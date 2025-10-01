#ifndef GROUPCHATSERVER_H
#define GROUPCHATSERVER_H

#include <QObject>
#include<QTcpServer>
#include<QTcpSocket>
#include<QList>

class GroupChatServer : public QObject
{
    Q_OBJECT
public:
    explicit GroupChatServer(QObject *parent = nullptr);

    bool start(const QString& host, quint16 port);
public slots:
    //服务器
    void slot_acceptError(QAbstractSocket::SocketError socketError);
    void slot_newConnection();
    //客户端
    void slot_disconnected();
    void slot_errorOccurred(QAbstractSocket::SocketError socketError);
    void slot_readyread();
signals:
private:
    QTcpServer* m_server;              //服务器
    QList<QTcpSocket*> m_sockets;      //客户端
};

#endif // GROUPCHATSERVER_H
