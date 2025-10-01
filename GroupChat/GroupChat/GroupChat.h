#ifndef GROUPCHAT_H
#define GROUPCHAT_H

#include <QWidget>
#include<QTcpSocket>

QT_BEGIN_NAMESPACE
namespace Ui {
class GroupChat;
}
QT_END_NAMESPACE

class GroupChat : public QWidget
{
    Q_OBJECT

public:
    GroupChat(QWidget *parent = nullptr);
    ~GroupChat();

    void start(const QString& host,qint16 port);

private slots:
    void on_snedBtn_clicked();
    void slot_connected();
    void slot_disconnected();
    void slot_errorOccurred(QAbstractSocket::SocketError sockerError);
    void slot_readyread();

private:
    Ui::GroupChat *ui;
    QTcpSocket* m_client;
};
#endif // GROUPCHAT_H
