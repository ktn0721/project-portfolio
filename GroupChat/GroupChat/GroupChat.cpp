#include "GroupChat.h"
#include "ui_GroupChat.h"
#include <QDateTime>

GroupChat::GroupChat(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::GroupChat)
    , m_client(new QTcpSocket(this))
{
    ui->setupUi(this);
    start("127.0.0.1",8848);
}

GroupChat::~GroupChat()
{
    delete ui;
}

void GroupChat::start(const QString &host, qint16 port)
{
    m_client->connectToHost(QHostAddress(host),port);
    connect( m_client,&QTcpSocket::connected,this,&GroupChat::slot_connected);
    connect( m_client,&QTcpSocket::disconnected,this,&GroupChat::slot_disconnected);
    connect( m_client,&QTcpSocket::errorOccurred,this,&GroupChat::slot_errorOccurred);
    connect( m_client,&QTcpSocket::readyRead,this,&GroupChat::slot_readyread);
}

void GroupChat::on_snedBtn_clicked()
{
    //获取输入文本信息
    auto msg = ui->sendTextEdit->toPlainText();
    //发送给服务器
    if (!msg.isEmpty()) {
        m_client->write(msg.toUtf8());

        // 发送后清空输入框
        ui->sendTextEdit->clear();
    }
}

void GroupChat::slot_connected()
{
    qDebug()<<"Connect Successful~";
}

void GroupChat::slot_disconnected()
{
    qDebug()<<"Disconnect~";
}

void GroupChat::slot_errorOccurred(QAbstractSocket::SocketError sockerError)
{
    qWarning()<<m_client->errorString();
}

void GroupChat::slot_readyread()
{
    //读取数据，显示到输出框中
    auto msg = m_client->readAll();
    //将消息写入到接收文本框
    //获取当前日期和时间
    auto dt = QDateTime::currentDateTime().toString("yyyy-MM-dd hh:mm:ss");
    ui->recvTextEdit->insertPlainText(QString("[%1]:%2").arg(dt).arg(msg + "\n"));
}

