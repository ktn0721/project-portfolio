#include "GroupChat.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    GroupChat w;
    w.show();
    return a.exec();
}
