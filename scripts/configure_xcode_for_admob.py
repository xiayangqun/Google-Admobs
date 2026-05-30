#!/usr/bin/env python3
"""
configure_xcode_for_admob.py

自动配置 Xcode 工程以支持 Google AdMob SDK

功能：
1. 添加 GoogleMobileAds.xcframework 和 UserMessagingPlatform.xcframework（Embed & Sign）
2. 添加 GoogleMobileAdsPlaceholder.swift
3. 设置 SWIFT_VERSION = 6
4. 添加 -ObjC linker flag

用法：
    python3 configure_xcode_for_admob.py <pbxproj_path> <sdk_dir> [--project-name NAME]

参数：
    pbxproj_path    project.pbxproj 文件路径
    sdk_dir         SDK 目录路径（包含 xcframework 和 swift 文件）
    --project-name  Cocos 构建选项中的项目名（用于匹配 target）

依赖：
    pip install pbxproj>=3.2.0,<5.0.0
"""

import sys
import os
from pathlib import Path
from datetime import datetime

# ==============================================================================
# 日志配置
# ==============================================================================
_script_dir = Path(__file__).parent.resolve()
_log_path = _script_dir / f"{Path(__file__).stem}.log"


class _StdoutFilter:
    """拦截 sys.stdout 写入，过滤 pbxproj 内部噪声，同时写入日志文件"""
    def __init__(self, stream):
        self.stream = stream
        self.line_buffer = ""

    def write(self, text):
        self.line_buffer += text
        while '\n' in self.line_buffer:
            line, self.line_buffer = self.line_buffer.split('\n', 1)
            line += '\n'
            if 'falling back to slow mechanism' not in line:
                self.stream.write(line)
                try:
                    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    with open(_log_path, 'a', encoding='utf-8') as f:
                        f.write(f"[{timestamp}] {line}")
                except Exception:
                    pass

    def flush(self):
        if self.line_buffer:
            self.stream.write(self.line_buffer)
            self.line_buffer = ""
        self.stream.flush()


sys.stdout = _StdoutFilter(sys.stdout)
sys.stderr = _StdoutFilter(sys.stderr)

# ==============================================================================
# 依赖检查
# ==============================================================================
try:
    from pbxproj import XcodeProject
    from pbxproj.pbxextensions.ProjectFiles import FileOptions
except ImportError:
    print("错误: 未找到 pbxproj 库。请先安装依赖:")
    print("  pip install pbxproj>=3.2.0,<5.0.0")
    sys.exit(1)


# ==============================================================================
# 核心逻辑
# ==============================================================================

def find_main_target(project, project_name=None):
    """
    从项目中查找主 executable target。
    
    匹配策略（按优先级）：
    1. 如果提供了 project_name，优先匹配 productType=application 且名称包含 project_name 的 target
    2. 匹配任意 productType=application 的 target（主 app）
    3. 回退到第一个 PBXNativeTarget
    """
    targets = list(project.objects.get_targets(None))
    native_targets = [t for t in targets if t.isa == 'PBXNativeTarget']

    # 1. 如果提供了 project_name，优先匹配名称包含 project_name 的 application target
    if project_name:
        for target in native_targets:
            product_type = getattr(target, 'productType', '')
            if 'application' in product_type and project_name in target.name:
                return target.name

    # 2. 优先找任意 application target
    for target in native_targets:
        product_type = getattr(target, 'productType', '')
        if 'application' in product_type:
            return target.name

    # 3. 回退：返回第一个 native target
    if native_targets:
        return native_targets[0].name

    return None


def fix_file_reference_to_absolute(project, abs_path):
    """将指定绝对路径对应的 file reference 修正为 <absolute> source tree"""
    file_name = Path(abs_path).name
    for obj in project.objects.get_objects_in_section('PBXFileReference'):
        if hasattr(obj, 'path'):
            path_val = str(obj.path)
            if (path_val == abs_path or path_val.endswith(file_name) or 
                path_val.strip('"') == abs_path or path_val.strip('"').endswith(file_name)):
                obj.path = abs_path
                obj.sourceTree = "<absolute>"
                return True
    return False


def configure_xcode_project(pbxproj_path, sdk_dir, project_name=None):
    """
    配置 Xcode 工程以支持 Google AdMob SDK
    
    1. 向主 target 添加 GoogleMobileAds.xcframework 和 UserMessagingPlatform.xcframework（Embed & Sign）
    2. 向主 target 添加 GoogleMobileAdsPlaceholder.swift
    3. 设置 SWIFT_VERSION = 6
    4. 添加 -ObjC linker flag
    """
    
    print(f"正在加载项目: {pbxproj_path}")
    project = XcodeProject.load(pbxproj_path)
    
    # 查找主 target
    target_name = find_main_target(project, project_name)
    if not target_name:
        print("错误: 无法从项目中找到主 target")
        return False
    
    print(f"找到主 target: {target_name}")
    if project_name:
        print(f"  (基于构建选项中的项目名: {project_name})")
    
    # 获取项目根目录（.xcodeproj 所在目录的父目录）
    proj_root = Path(pbxproj_path).parent.parent
    print(f"项目根目录: {proj_root}")
    
    # 检查 SDK 目录
    sdk_path = Path(sdk_dir)
    if not sdk_path.exists():
        print(f"错误: SDK 目录不存在: {sdk_dir}")
        return False
    
    # 1. 添加 xcframework（Embed & Sign）
    frameworks = [
        str(sdk_path / "GoogleMobileAds.xcframework"),
        str(sdk_path / "UserMessagingPlatform.xcframework"),
    ]
    
    print(f"\n正在添加 AdMob Frameworks 到 target '{target_name}':")
    for abs_path in frameworks:
        if not Path(abs_path).exists():
            print(f"  警告: Framework 不存在 - {abs_path}")
            continue
        
        print(f"  添加: {abs_path}")
        # 使用 force=False 避免重复添加
        results = project.add_file(
            abs_path,
            target_name=target_name,
            force=False,
            file_options=FileOptions()
        )
        # 修正 sourceTree 为 <absolute>，避免 Xcode 在错误位置查找
        fix_file_reference_to_absolute(project, abs_path)
        if results:
            print(f"    成功添加 ({len(results)} 个 build files)")
        else:
            print(f"    文件已存在或添加失败")
    
    # 2. 添加 Swift 占位文件（同样使用绝对路径）
    swift_path = str(sdk_path / "GoogleMobileAdsPlaceholder.swift")
    
    print(f"\n正在添加 Swift 占位文件到 target '{target_name}':")
    if Path(swift_path).exists():
        print(f"  添加: {swift_path}")
        results = project.add_file(
            swift_path,
            target_name=target_name,
            force=False
        )
        # 修正 sourceTree 为 <absolute>
        fix_file_reference_to_absolute(project, swift_path)
        if results:
            print(f"    成功添加 ({len(results)} 个 build files)")
        else:
            print(f"    文件已存在或添加失败")
    else:
        print(f"  警告: Swift 占位文件不存在 - {swift_path}")
    
    # 3. 设置 SWIFT_VERSION = 6
    print(f"\n正在设置 Build Settings:")
    print(f"  SWIFT_VERSION = 6")
    project.set_flags('SWIFT_VERSION', '6', target_name=target_name)
    
    # 4. 添加 -ObjC linker flag（如果还没有的话）
    print(f"  检查 OTHER_LDFLAGS (-ObjC)")
    project.add_other_ldflags('-ObjC', target_name=target_name)
    
    # 保存项目
    print(f"\n正在保存项目...")
    project.save()
    print("项目保存成功!")
    
    return True


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    pbxproj_path = sys.argv[1]
    sdk_dir = sys.argv[2]
    project_name = None
    
    # 解析 --project-name 参数
    if '--project-name' in sys.argv:
        idx = sys.argv.index('--project-name')
        if idx + 1 < len(sys.argv):
            project_name = sys.argv[idx + 1]
    
    pbxproj = Path(pbxproj_path)
    if not pbxproj.exists():
        print(f"错误: 文件不存在 {pbxproj_path}")
        sys.exit(1)
    
    if not pbxproj.name == 'project.pbxproj':
        print(f"警告: 文件可能不是 project.pbxproj: {pbxproj.name}")
    
    success = configure_xcode_project(str(pbxproj), sdk_dir, project_name)
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
