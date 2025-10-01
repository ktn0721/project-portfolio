#include "GroupChatServer.h"

GroupChatServer::GroupChatServer(QObject *parent)
    : QObject{parent}
    , m_server(new QTcpServer(this))
{
    //连接服务器信号
    connect(m_server,&QTcpServer::acceptError,this,&GroupChatServer::slot_acceptError);
    connect(m_server,&QTcpServer::newConnection,this,&GroupChatServer::slot_newConnection);
}

bool GroupChatServer::start(const QString &host, quint16 port)
{
    if(m_server->isListening())
    {
        qDebug()<<"Server already listening";
        return false;
    }
    if(!m_server->listen(QHostAddress(host), port))
    {
        qDebug()<<"Server listen failed:"<<m_server->errorString();
        return false;
    }
    return true;
}

void GroupChatServer::slot_acceptError(QAbstractSocket::SocketError socketError)
{
    qWarning()<<m_server->errorString();
}

void GroupChatServer::slot_newConnection()
{
    //有未处理的链接
    while(m_server->hasPendingConnections())
    {
        //获取下一个有效的链接
        auto socket = m_server->nextPendingConnection();
        //添加到数组中
        m_sockets.push_back(socket);
        //接收来自客户端的数据
        connect(socket,&QTcpSocket::disconnected,this,&GroupChatServer::slot_disconnected);
        connect(socket,&QTcpSocket::errorOccurred,this,&GroupChatServer::slot_errorOccurred);
        connect(socket,&QTcpSocket::readyRead,this,&GroupChatServer::slot_readyread);
    }
}

void GroupChatServer::slot_disconnected()
{
    auto sock = dynamic_cast<QTcpSocket*>(sender());
    //客户端断开连接，从数组中移除掉
    m_sockets.removeOne(sock);
}

void GroupChatServer::slot_errorOccurred(QAbstractSocket::SocketError socketError)
{
    auto sock = dynamic_cast<QTcpSocket*>(sender());
    qWarning()<<sock->errorString();
}

void GroupChatServer::slot_readyread()
{
    auto sock = dynamic_cast<QTcpSocket*>(sender());
    //读取数据
    auto msg = sock->readAll();
    //转发数据
    for(const auto& socket:m_sockets)
    {
        //不能发给自己
        //if(socket==sock) continue;
        //发给其他用户
        socket->write(msg);
    }
}
