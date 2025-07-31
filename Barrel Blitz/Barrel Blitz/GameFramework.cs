using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace __Barrel_Blitz_
{
    enum GameState
    {
        Running,
        GameOver
    }
    internal class GameFramework
    {
        public static Graphics g;
        private static GameState gameState = GameState.Running;

        public static void Start()
        {
            GameObjectManager.Start();
            GameObjectManager.CreateMap();
            GameObjectManager.CreateMyTank();

            SoundManager.InitSound();
            SoundManager.PlayStart();
        }

        public static void Update()
        {//FPS
            //GameObjectManager.DrawMap();
            //GameObjectManager.DrawMyTank();

            if(gameState == GameState.Running)
            {
                GameObjectManager.Update();
            }else if(gameState == GameState.GameOver)
            {
                GameOverUpdate();
            }
        }

        public static void  ChangeToGameOver()
        {
            gameState = GameState.GameOver;
        }
        public static void GameOverUpdate()
        {
            int x = 390 / 2 - Properties.Resources.GameOver.Width / 2;
            int y = 420 / 2 - Properties.Resources.GameOver.Height / 2;
            g.DrawImage(Properties.Resources.GameOver, x, y);
        }
    }
}
