using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace __Barrel_Blitz_
{
    internal class GameObjectManager
    {
        #region 地图
        private static List<NotMoveThing> wallList = new List<NotMoveThing>();
        private static List<NotMoveThing> steelList = new List<NotMoveThing>();
        private static NotMoveThing Boss;

        public static void CreateMap()
        {
            CreateWall(1, 1, 5, Properties.Resources.wall, wallList);
            CreateWall(3, 1, 5, Properties.Resources.wall, wallList);
            CreateWall(5, 1, 4, Properties.Resources.wall, wallList);
            CreateWall(7, 1, 4, Properties.Resources.wall, wallList);
            CreateWall(9, 1, 5, Properties.Resources.wall, wallList);
            CreateWall(11, 1, 5, Properties.Resources.wall, wallList);

            CreateWall(6, 3, 1, Properties.Resources.steel, steelList);

            CreateWall(2, 7, 1, Properties.Resources.wall, wallList);
            CreateWall(3, 7, 1, Properties.Resources.wall, wallList);
            CreateWall(5, 6, 1, Properties.Resources.wall, wallList);
            CreateWall(7, 6, 1, Properties.Resources.wall, wallList);
            CreateWall(9, 7, 1, Properties.Resources.wall, wallList);
            CreateWall(10, 7, 1, Properties.Resources.wall, wallList);

            CreateWall2(0, 15, 1, Properties.Resources.steel, steelList);
            CreateWall2(1, 15, 1, Properties.Resources.steel, steelList);
            CreateWall2(24, 15, 1, Properties.Resources.steel, steelList);
            CreateWall2(25, 15, 1, Properties.Resources.steel, steelList);

            CreateWall(1, 9, 4, Properties.Resources.wall, wallList);
            CreateWall(3, 9, 4, Properties.Resources.wall, wallList);
            CreateWall(5, 8, 3, Properties.Resources.wall, wallList);
            CreateWall(6, 9, 1, Properties.Resources.wall, wallList);
            CreateWall(7, 8, 3, Properties.Resources.wall, wallList);
            CreateWall(9, 9, 4, Properties.Resources.wall, wallList);
            CreateWall(11, 9, 4, Properties.Resources.wall, wallList);

            CreateWall2(11, 25, 3, Properties.Resources.wall, wallList);
            CreateWall2(14, 25, 3, Properties.Resources.wall, wallList);
            CreateWall2(12, 25, 1, Properties.Resources.wall, wallList);
            CreateWall2(13, 25, 1, Properties.Resources.wall, wallList);

            CreateBoss(12, 26, Properties.Resources.Boss);
        }

        private static void CreateWall(int x, int y, int count, Image Img, List<NotMoveThing> wallList)
        {
            int xPosition = x * 30;
            int yPosition = y * 30;
            for(int i = yPosition; i < yPosition + count * 30; i += 15)//从上到下创建
            {
                NotMoveThing wall1 = new NotMoveThing(xPosition, i, Img);
                NotMoveThing wall2 = new NotMoveThing(xPosition + 15, i, Img);
                wallList.Add(wall1);
                wallList.Add(wall2);
            }
        }

        private static void CreateWall2(int x, int y, int count, Image Img, List<NotMoveThing> wallList)
        {
            int xPosition = x * 15;
            int yPosition = y * 15;
            for (int i = yPosition; i < yPosition + count * 15; i += 15)//从上到下创建
            {
                NotMoveThing wall1 = new NotMoveThing(xPosition, i, Img);
                //NotMoveThing wall2 = new NotMoveThing(xPosition + 15, i, Img);
                wallList.Add(wall1);
                //wallList.Add(wall2);
            }
        }

        private static void CreateBoss(int x, int y, Image Img)
        {
            int xPosition = x * 15;
            int yPosition = y * 15;
            Boss = new NotMoveThing(xPosition, yPosition, Img);
        }

        //public static void DrawMap()
        //{
        //    foreach (NotMoveThing thing in wallList)
        //    {
        //        thing.DrawSelf();
        //    }
        //    foreach (NotMoveThing thing in steelList)
        //    {
        //        thing.DrawSelf();
        //    }
        //    Boss.DrawSelf();
        //}

        public static void DestoryWall(NotMoveThing wall)
        {
            wallList.Remove(wall);
        }
        #endregion

        #region 坦克
        private static MyTank myTank;

        public static void CreateMyTank()
        {
            int x = 9 * 15;
            int y = 13 * 30;

            myTank = new MyTank(x, y, 2);
        }

        //public static void DrawMyTank()
        //{
        //    myTank.DrawSelf();
        //}

        #endregion

        #region 敌人坦克
        private static int enemyBornSpeed = 60;
        private static int enemyBornCount = 60;
        private static Point[] points = new Point[3];
        private static List<EnemyTank> tankList = new List<EnemyTank>();

        public static void Start()
        {
            points[0].X = 0; points[0].Y = 0;
            points[1].X = 6 * 30; points[1].Y = 0;
            points[2].X = 12 * 30; points[2].Y = 0;
        }

        private static void CreateEnemyTank1(int x, int y)
        {
            EnemyTank tank = new EnemyTank(x, y, 2, Properties.Resources.GrayUp,
                Properties.Resources.GrayDown, Properties.Resources.GrayLeft, Properties.Resources.GrayRight);
            tankList.Add(tank);
        }
        private static void CreateEnemyTank2(int x, int y)
        {
            EnemyTank tank = new EnemyTank(x, y, 2, Properties.Resources.GreenUp,
                Properties.Resources.GreenDown, Properties.Resources.GreenLeft, Properties.Resources.GreenRight);
            tankList.Add(tank);
        }
        private static void CreateEnemyTank3(int x, int y)
        {
            EnemyTank tank = new EnemyTank(x, y, 4, Properties.Resources.QuickUp,
                Properties.Resources.QuickDown, Properties.Resources.QuickLeft, Properties.Resources.QuickRight);
            tankList.Add(tank);
        }
        private static void CreateEnemyTank4(int x, int y)
        {
            EnemyTank tank = new EnemyTank(x, y, 1, Properties.Resources.SlowUp,
                Properties.Resources.SlowDown, Properties.Resources.SlowLeft, Properties.Resources.SlowRight);
            tankList.Add(tank);
        }

        private static void EnemyBorn()
        {
            enemyBornCount++;
            if (enemyBornCount < enemyBornSpeed) return;

            SoundManager.PlayAdd();
            Random rd = new Random();
            int index = rd.Next(0, 3);
            Point position = points[index];
            int enemyType = rd.Next(0, 5);
            switch (enemyType)
            {
                case 1:
                    CreateEnemyTank1(position.X, position.Y); break;
                case 2:
                    CreateEnemyTank2(position.X, position.Y); break;
                case 3:
                    CreateEnemyTank3(position.X, position.Y); break;
                case 4:
                    CreateEnemyTank4(position.X, position.Y); break;
            }

            enemyBornCount = 0;
        }

        public static void DestoryEnemyTank(EnemyTank tank)
        {
            tankList.Remove(tank);
        }

        #endregion

        #region 碰撞
        public static NotMoveThing IsCollidedWall(Rectangle rt)
        {
            foreach (NotMoveThing thing in wallList)
            {
                if (thing.GetRectangle().IntersectsWith(rt))
                {
                    return thing;
                }
            }
            return null;
        }
        public static NotMoveThing IsCollidedSteel(Rectangle rt)
        {
            foreach (NotMoveThing thing in steelList)
            {
                if (thing.GetRectangle().IntersectsWith(rt))
                {
                    return thing;
                }
            }
            return null;
        }
        public static bool IsCollidedBoss(Rectangle rt)
        {
            return Boss.GetRectangle().IntersectsWith(rt);
        }
        public static EnemyTank IsCollidedEnemyTank(Rectangle rt)
        {
            foreach(EnemyTank tank in tankList)
            {
                if (tank.GetRectangle().IntersectsWith(rt)) return tank;
            }
            return null;
        }
        public static MyTank IsCollidedMyTank(Rectangle rt)
        {
            if (myTank.GetRectangle().IntersectsWith(rt)) return myTank;
            return null;
        }

        #endregion

        #region 子弹
        private static  List<Bullet> bulletList = new List<Bullet>();
        public static void CreateBullet(int x, int y,Direction dir, Tag tag)
        {
            Bullet bullet = new Bullet(x, y, 5, dir, tag);
            bulletList.Add(bullet);
        }

        public static void DestoryBullet(Bullet bullet)
        {
            bulletList.Remove(bullet);
        }
        #endregion

        #region 爆炸
        private static List<Explosion> expList = new List<Explosion>();
        public static void CreateExplosition(int x, int y)
        {
            Explosion exp = new Explosion(x, y);
            expList.Add(exp);
        }

        public static void DestoryExplosion(Explosion exp)
        {
            expList.Remove(exp);
        }

        #endregion

        public static void Update()
        {
            foreach (NotMoveThing thing in wallList)
            {
                thing.Update();
            }
            foreach (NotMoveThing thing in steelList)
            {
                thing.Update();
            }
            Boss.Update();

            myTank.Update();

            EnemyBorn();
            foreach (EnemyTank tank in tankList)
            {
                tank.Update();
            }

            for (int i = 0; i < bulletList.Count; i++)
            {
                bulletList[i].Update();
            }

            for (int i = 0; i < expList.Count; i++)
            {
                expList[i].Update();
            }
        }

        //监测 消息的中间站
        public static void KeyDown(KeyEventArgs args)
        {
            myTank.KeyDown(args);
        }
        public static void KeyUp(KeyEventArgs args)
        {
            myTank.KeyUp(args);
        }
    }
}
