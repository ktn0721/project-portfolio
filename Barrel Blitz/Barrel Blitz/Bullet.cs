using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace __Barrel_Blitz_
{
    enum Tag
    {
        MyTank,
        EnemyTank
    }
    internal class Bullet : MoveThing
    {
        public Tag tag { get; set; }

        public Bullet(int x, int y, int speed, Direction dir, Tag tag)
        {
            this.X = x;
            this.Y = y;
            this.Speed = speed;
            this.BitmapUp = Properties.Resources.BulletUp;
            this.BitmapDown = Properties.Resources.BulletDown;
            this.BitmapLeft = Properties.Resources.BulletLeft;
            this.BitmapRight = Properties.Resources.BulletRight;
            this.Dir = dir;
            this.tag = tag;

            this.X -= Width / 2;
            this.Y -= Height / 2;
        }

        public override void DrawSelf()
        {
            base.DrawSelf();
        }

        public override void Update()
        {
            MoveCheck();//移动检查
            Move();

            base.Update();
        }

        private void Move()
        {
            switch (Dir)
            {
                case Direction.Up:
                    Y -= Speed; break;
                case Direction.Down:
                    Y += Speed; break;
                case Direction.Left:
                    X -= Speed; break;
                case Direction.Right:
                    X += Speed; break;
            }
        }
        private void MoveCheck()
        {
            //边界
            if (Dir == Direction.Up)
            {
                if (Y + Height / 2 + 3 < 0)
                {
                    GameObjectManager.DestoryBullet(this);return;
                }
            }
            else if (Dir == Direction.Down)
            {
                if (Y + Height / 2 - 3 > 420)
                {
                    GameObjectManager.DestoryBullet(this); return;
                }
            }
            else if (Dir == Direction.Left)
            {
                if (X + Width / 2 - 3 < 0)
                {
                    GameObjectManager.DestoryBullet(this); return;
                }
            }
            else if (Dir == Direction.Right)
            {
                if (X + Width / 2 + 3 > 390)
                {
                    GameObjectManager.DestoryBullet(this); return;
                }
            }
            //碰撞
            Rectangle rect = GetRectangle();

            rect.X = X + Width / 2 - 3;
            rect.Y = Y + Height / 2 - 3;
            rect.Width = 3;
            rect.Height = 3;

            int xExp = this.X + Width / 2;
            int yExp = this.Y + Height / 2;

            //墙
            NotMoveThing wall = null;
            if ((wall = GameObjectManager.IsCollidedWall(rect)) != null)
            {
                GameObjectManager.DestoryBullet(this); 
                GameObjectManager.DestoryWall(wall);
                GameObjectManager.CreateExplosition(xExp, yExp);
                SoundManager.PlayBlast();
                return;
            }
            //铁墙
            if (GameObjectManager.IsCollidedSteel(rect) != null)
            {
                GameObjectManager.DestoryBullet(this); 
                GameObjectManager.CreateExplosition(xExp, yExp);
                SoundManager.PlayBlast();
                return;
            }
            //Boss
            if (GameObjectManager.IsCollidedBoss(rect))
            {
                SoundManager.PlayBlast();
                GameFramework.ChangeToGameOver(); return;
            }
            //坦克
            if (tag==Tag.MyTank)
            {
                EnemyTank tank = null;
                if((tank = GameObjectManager.IsCollidedEnemyTank(rect)) != null)
                {
                    GameObjectManager.DestoryBullet(this);
                    GameObjectManager.DestoryEnemyTank(tank);
                    GameObjectManager.CreateExplosition(xExp, yExp);
                    SoundManager.PlayBlast();
                    return;
                }
            }else if(tag == Tag.EnemyTank)
            {
                MyTank mytank = null;
                if ((mytank = GameObjectManager.IsCollidedMyTank(rect)) != null)
                {
                    GameObjectManager.DestoryBullet(this);
                    GameObjectManager.CreateExplosition(xExp, yExp);
                    SoundManager.PlayHit();
                    mytank.TakeDamage();
                    return;
                }
            }
        }
    }
}
