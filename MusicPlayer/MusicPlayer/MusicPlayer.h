#pragma once

#include <QtWidgets/QMainWindow>
#include "ui_MusicPlayer.h"
#include <QString>
#include <QPushButton>

/*音乐类*/
#include <QAudioOutput>
#include <QMediaPlayer>

enum PLAYMODE
{
    ORDER_MODE,
    RANDOM_MODE,
    CIRCLE_MODE
};

class MusicPlayer : public QMainWindow
{
    Q_OBJECT

public:
    MusicPlayer(QWidget *parent = nullptr);
    ~MusicPlayer();

    void initButtons();//初始化按钮
    void setButtonStyle(QPushButton* button, const QString& filename);//设置按钮样式
    void setBackGround(const QString& filename);//设置背景
    void loadAppointMusicDir(const QString& filepath);//加载指定文件夹
    void startPlayMusic();//播放音乐
    void showAnimation(QWidget* window);//显示动画
    void hideAnimation(QWidget* window);//隐藏动画

public slots:
    void slot_play();//处理播放暂停
    void slot_mode();//处理播放模式
    void slot_next();//处理下一首
    void slot_prev();//处理上一首
    void slot_list();//处理音乐列表

private:
    Ui::MusicPlayerClass ui;

    QMediaPlayer* m_player;//音乐播放器
    QAudioOutput* m_audioOutput;//音频输出

    PLAYMODE m_mode;//当前播放模式

    QString m_musicDir;//音乐文件夹路径

    bool m_isShowFlag;//列表存在的状态
};

