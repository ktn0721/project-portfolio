using __Barrel_Blitz_;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace _​​Barrel_Blitz​
{
    public partial class Form1 : Form
    {
        private Thread t;
        private static Graphics windowG;
        private static Bitmap tempBmp;

        public Form1()
        {
            InitializeComponent();
            this.StartPosition = FormStartPosition.CenterScreen;

            windowG = this.CreateGraphics();
            //GameFramework.g = g;
            //直接绘画画面会闪烁，将所有东西绘制到一张图片后再传到画布
            tempBmp = new Bitmap(390, 420);
            Graphics bmpG = Graphics.FromImage(tempBmp);
            GameFramework.g = bmpG;

            //阻塞
            t = new Thread(new ThreadStart(GameMainThread));
            t.Start(); 
        }

        private static void GameMainThread()
        {
            //GameFramework
            GameFramework.Start();

            int sleepTime = 1000 / 60;

            //程序执行还会花时间，所以执行次数一定小于60次
            while (true)
            {
                GameFramework.g.Clear(Color.Black);//背景涂黑

                GameFramework.Update();

                windowG.DrawImage(tempBmp, 0, 0);

                Thread.Sleep(sleepTime);//60帧    
            }
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            t.Abort();
        }

        private void Form1_KeyDown(object sender, KeyEventArgs e)
        {
            GameObjectManager.KeyDown(e);
        }

        private void Form1_KeyUp(object sender, KeyEventArgs e)
        {
            GameObjectManager.KeyUp(e);
        }
    }
}
