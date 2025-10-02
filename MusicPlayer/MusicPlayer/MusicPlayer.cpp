#include "MusicPlayer.h"
#include <QIcon>
#include <QTime>

/*图片类*/
#include <QPixMap>
#include <QPalette>

/*文件类*/
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QMessageBox>//对话框

/*动画类*/
#include <QPropertyAnimation>

MusicPlayer::MusicPlayer(QWidget *parent)
    : QMainWindow(parent),
    m_mode(ORDER_MODE),
    m_isShowFlag(false)
{
    ui.setupUi(this);

    setFixedSize(800, 450);//固定窗口大小
    setBackGround(":/image/background1.png");//设置背景
    initButtons();//初始化按钮

    m_player = new QMediaPlayer(this);
    m_audioOutput = new QAudioOutput(this);
    m_player->setAudioOutput(m_audioOutput);//将音频输出设置给播放器
    m_audioOutput->setVolume(0.3);
    /*加载并播放音乐*/
    QString musicPath = "C:\\Sundries\\Qt\\MusicPlayer\\MusicPlayer\\music\\山本美禰子 - 輪廻.mp3";
    m_player->setSource(QUrl::fromLocalFile(musicPath));
    //m_player->play();

    /*加载音乐文件夹*/
    m_musicDir = "C:\\Sundries\\Qt\\MusicPlayer\\MusicPlayer\\music\\";
    loadAppointMusicDir(m_musicDir);

    srand(time(NULL));//随机数种子
}

void MusicPlayer::setButtonStyle(QPushButton* button, const QString& filename)
{
    setWindowTitle("音乐播放器");//设置标题
    button->setFixedSize(50, 50);//设置按钮大小
    button->setIcon(QIcon(filename));//设置按钮图标
    button->setIconSize(QSize(button->width(), button->height()));//设置图标大小
    button->setStyleSheet("background-color:transparent");//设置按钮背景为透明色
}
void MusicPlayer::initButtons()
{
    setButtonStyle(ui.prevBtn, ":/Icon/prev.png");
    setButtonStyle(ui.playBtn, ":/Icon/play.png");
    setButtonStyle(ui.nextBtn, ":/Icon/next.png");
    setButtonStyle(ui.modeBtn, ":/Icon/order.png");
    setButtonStyle(ui.listBtn, ":/Icon/music.png");

    /*信号和槽*/
    connect(ui.playBtn, &QPushButton::clicked, this, &MusicPlayer::slot_play);
    connect(ui.modeBtn, &QPushButton::clicked, this, &MusicPlayer::slot_mode);
    connect(ui.nextBtn, &QPushButton::clicked, this, &MusicPlayer::slot_next);
    connect(ui.prevBtn, &QPushButton::clicked, this, &MusicPlayer::slot_prev);
    connect(ui.listBtn, &QPushButton::clicked, this, &MusicPlayer::slot_list);

    /*设置风格*/
    ui.musicList->setStyleSheet("QListWidget{"
        "border: none;"
        "border-radius: 20px;"
        "background-color: rgba(255,255,255,0.7);}");
    ui.musicList->hide();//初始化隐藏列表
}
void MusicPlayer::setBackGround(const QString& filename)
{
    QPixmap* pixmap = new QPixmap(filename);//创建照片
    QSize windowSize = this->size();//获取当前窗口大小
    QPixmap scalePixmap = pixmap->scaled(windowSize, Qt::IgnoreAspectRatio, Qt::SmoothTransformation);//缩放图片到当前窗口大小
    /*创建QPalette对象并设置背景照片 - 调色板*/
    QPalette palette = this->palette();
    palette.setBrush(QPalette::Window, QBrush(scalePixmap));
    this->setPalette(palette);//将调色板应用到窗口上
    delete pixmap;
}

void MusicPlayer::slot_play()
{
    if (m_player->playbackState() == QMediaPlayer::PlayingState)
    {
        m_player->pause();
        ui.playBtn->setIcon(QIcon(":/Icon/play.png"));
    }
    else
    {
        m_player->play();
        ui.playBtn->setIcon(QIcon(":/Icon/stop.png"));
    }
}
void MusicPlayer::loadAppointMusicDir(const QString& filepath)
{
    QDir dir(filepath);
    if (dir.exists() == false)
    {
        QMessageBox::warning(this, "文件夹", "文件夹打开失败");
        return;
    }
    QFileInfoList fileList = dir.entryInfoList(QDir::Files);
    for (const auto& element : fileList)
    {
        if (element.suffix() == "mp3") ui.musicList->addItem(element.baseName());
    }

    /*默认第一行高亮*/
    ui.musicList->setCurrentRow(0);
}
void MusicPlayer::slot_mode()
{
    if (m_mode == ORDER_MODE)
    {
        m_mode = RANDOM_MODE;
        ui.modeBtn->setIcon(QIcon(":/Icon/random.png"));
    }
    else if (m_mode == RANDOM_MODE)
    {
        m_mode = CIRCLE_MODE;
        ui.modeBtn->setIcon(QIcon(":/Icon/circle.png"));
    }
    else
    {
        m_mode = ORDER_MODE;
        ui.modeBtn->setIcon(QIcon(":/Icon/order.png"));
    }
}
void MusicPlayer::slot_next()
{
    int currentRow = ui.musicList->currentRow();//当前播放的音乐
    int nextRow = 0;
	if (m_mode == ORDER_MODE) nextRow = (currentRow + 1) % ui.musicList->count();
    else if (m_mode == RANDOM_MODE)
    {
        int cnt = 0;
        do
        {
            nextRow = rand() % ui.musicList->count();
            cnt++;
		} while (nextRow == currentRow && cnt < 4);
    }
    else nextRow = currentRow;

    ui.musicList->setCurrentRow(nextRow);
    startPlayMusic();
}
void MusicPlayer::slot_prev()
{
    int currentRow = ui.musicList->currentRow();//当前播放的音乐
    int prevRow = 0;
    if (m_mode == ORDER_MODE)
    {
        prevRow = currentRow - 1;
        if (prevRow < 0) prevRow = ui.musicList->count() - 1;
    }
    else if (m_mode == RANDOM_MODE)
    {
        int cnt = 0;
        do
        {
            prevRow = rand() % ui.musicList->count();
            cnt++;
        } while (prevRow == currentRow && cnt < 4);
    }
    else  prevRow = currentRow;
 
    ui.musicList->setCurrentRow(prevRow);
    startPlayMusic();
}
void MusicPlayer::startPlayMusic()
{
    QString musicName = ui.musicList->currentItem()->text();
    QString musicAbsPath = m_musicDir + musicName + ".mp3";//音乐的绝对路径
    m_player->setSource(QUrl::fromLocalFile(musicAbsPath));
    slot_play();
}

void MusicPlayer::slot_list()
{
    if (m_isShowFlag == false)
    {
        m_isShowFlag = true;
        ui.musicList->show();
        showAnimation(ui.musicList);
    }
    else
    {
        // 关键点：只需要启动 hideAnimation，hide() 操作会在动画结束后自动执行
        m_isShowFlag = false;
        // 移除 ui.musicList->hide(); 
        hideAnimation(ui.musicList);
    }
}
void MusicPlayer::showAnimation(QWidget* window)
{
    QPropertyAnimation* animation = new  QPropertyAnimation(window, "pos", this);
    animation->setDuration(500);//动画持续时间
    animation->setStartValue(QPoint(this->width(), 0));//起始坐标
	animation->setEndValue(QPoint(this->width() - ui.musicList->width(), 0));//结束坐标
    animation->start();

    connect(animation, &QPropertyAnimation::finished, animation, &QObject::deleteLater); //等待动画结束
}
void MusicPlayer::hideAnimation(QWidget* window)
{
    QPropertyAnimation* animation = new  QPropertyAnimation(window, "pos", this);
    animation->setDuration(500);//动画持续时间
    animation->setStartValue(QPoint(this->width() - ui.musicList->width(), 0));//起始坐标
    animation->setEndValue(QPoint(this->width(), 0));//结束坐标
    animation->start();

    // 【移除 QEventLoop】
    connect(animation, &QPropertyAnimation::finished, animation, &QObject::deleteLater);

    // 关键：在隐藏动画结束后才执行 ui.musicList->hide()
    // 否则列表会立即消失，动画失效
    connect(animation, &QPropertyAnimation::finished, window, &QWidget::hide);
}

MusicPlayer::~MusicPlayer()
{}

