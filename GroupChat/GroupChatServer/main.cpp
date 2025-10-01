#include <QCoreApplication>
#include "GroupChatServer.h"

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    GroupChatServer server;
    server.start("0.0.0.0",8848);

    return a.exec();
}
