
set(ADMOB_PROJ_SOURCES)

list(APPEND ADMOB_PROJ_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/AdServiceHub.m
    ${CMAKE_CURRENT_LIST_DIR}/AdServiceHub.h
)

file(GLOB_RECURSE OTHER_FILES LIST_DIRECTORIES false
    "${CMAKE_CURRENT_LIST_DIR}/core/*.h"
    "${CMAKE_CURRENT_LIST_DIR}/core/*.m"
    "${CMAKE_CURRENT_LIST_DIR}/core/*.mm"
    "${CMAKE_CURRENT_LIST_DIR}/proto/*.h"
    "${CMAKE_CURRENT_LIST_DIR}/proto/*.m"
    "${CMAKE_CURRENT_LIST_DIR}/service/*.h"
    "${CMAKE_CURRENT_LIST_DIR}/service/*.m"
    "${CMAKE_CURRENT_LIST_DIR}/nativetemplates/*.h"
    "${CMAKE_CURRENT_LIST_DIR}/nativetemplates/*.m"
)
list(APPEND ADMOB_PROJ_SOURCES ${OTHER_FILES})

source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${ADMOB_PROJ_SOURCES})

foreach(file ${ADMOB_PROJ_SOURCES})
    get_filename_component(file_directory ${file} DIRECTORY)
    set_source_files_properties(${file} PROPERTIES COMPILE_OPTIONS "-fobjc-arc")
endforeach()

# 将 admob 源文件直接合并到主 executable target
target_sources(${EXECUTABLE_NAME} PRIVATE ${ADMOB_PROJ_SOURCES})

# admob 头文件搜索路径（直接设置给主 target）
target_include_directories(${EXECUTABLE_NAME} PRIVATE 
    "${CMAKE_CURRENT_LIST_DIR}"
    "${CMAKE_CURRENT_LIST_DIR}/proto"
    "${CMAKE_CURRENT_LIST_DIR}/proto/appopen"
    "${CMAKE_CURRENT_LIST_DIR}/proto/banner"
    "${CMAKE_CURRENT_LIST_DIR}/proto/interstitial"
    "${CMAKE_CURRENT_LIST_DIR}/proto/nativead"
    "${CMAKE_CURRENT_LIST_DIR}/proto/rewarded"
    "${CMAKE_CURRENT_LIST_DIR}/proto/rewarded-interstitial"
    "${CMAKE_CURRENT_LIST_DIR}/proto/ump"
    "${CMAKE_CURRENT_LIST_DIR}/core"
    "${CMAKE_CURRENT_LIST_DIR}/nativetemplates"
)

# 手动添加引擎头文件搜索路径
target_include_directories(${EXECUTABLE_NAME} PRIVATE
    "${COCOS_X_PATH}"
    "${COCOS_X_PATH}/cocos"
    "${COCOS_X_PATH}/cocos/platform"
    "${COCOS_X_PATH}/cocos/bindings/jswrapper"
    "${COCOS_X_PATH}/external/sources"
)

# -ObjC 链接选项（确保 Objective-C 类别被正确链接）
target_link_options(${EXECUTABLE_NAME} PRIVATE -ObjC)

# 链接 AppTrackingTransparency.framework（ATT 弹窗必需，iOS 14.5+）
find_library(ATT_FRAMEWORK AppTrackingTransparency)
if(ATT_FRAMEWORK)
    target_link_libraries(${EXECUTABLE_NAME} ${ATT_FRAMEWORK})
endif()

# 【移除】不再替换 Info.plist
# plist 修改改为在构建后用 PlistBuddy 完成（见 src/platforms/ios.ts modifyPlist）

# 【移除】不再需要手动配置 xcframework 和 Swift
# 这些操作改为在构建后用 Python 脚本完成（见 src/platforms/ios.ts configureXcodeProject）

# ==============================================================================
# 【说明】
# 1. Info.plist 修改：由 TypeScript 代码在 onAfterBuild 阶段使用 PlistBuddy 完成
# 2. xcframework 添加：由 Python 脚本 configure_xcode_for_admob.py 完成
# 3. Swift 版本设置：由 Python 脚本 configure_xcode_for_admob.py 完成（SWIFT_VERSION = 6）
# ==============================================================================
