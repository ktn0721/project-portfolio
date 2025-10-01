cmake_minimum_required(VERSION 3.19)
project(GroupChatServer LANGUAGES CXX)

find_package(Qt6 6.5 REQUIRED COMPONENTS Core Network)
find_package(Qt6 REQUIRED COMPONENTS Core Network)

qt_standard_project_setup()

qt_add_executable(GroupChatServer
    main.cpp
    GroupChatServer.h GroupChatServer.cpp
)

target_link_libraries(GroupChatServer
    PRIVATE
        Qt::Core
        Qt::Network
)
target_link_libraries(GroupChatServer PRIVATE Qt6::Core)

include(GNUInstallDirs)

install(TARGETS GroupChatServer
    BUNDLE  DESTINATION .
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
)
