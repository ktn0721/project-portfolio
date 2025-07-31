using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace __Barrel_Blitz_
{
    internal class EnemyTank : MoveThing
    {
        Random rd = new Random();
        public int AttackSpeed { get; set; }
        private int attackCount = 0;

        public int ChangeDirSpeed {  get; set; }
        private int changeDirCount = 0;

        public EnemyTank(int x, int y, int speed, Bitmap bitUp, Bitmap bitDown, Bitmap bitLeft, Bitmap bitRight)
        {
            this.X = x;
            this.Y = y;
            this.Speed = speed;
            this.BitmapUp = bitUp;
            this.BitmapDown = bitDown;
            this.BitmapLeft = bitLeft;
            this.BitmapRight = bitRight;
            this.Dir = Direction.Down;
            AttackSpeed = 60;
            ChangeDirSpeed = 100;
        }

        public override void Update()
        {
            MoveCheck();//移动检查
            Move();
            AttackCheck();
            AutoChangeDirection();

            base.Update();
        }

        private void ChangeDirection()
        {
            while (true)
            {
                Direction dir = (Direction)rd.Next(0, 4);
                if (dir == Dir) continue;
                else Dir = dir;break;
            }
            MoveCheck();
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
                if (Y - Speed < 0)
                {
                    ChangeDirection(); return;
                }
            }
            else if (Dir == Direction.Down)
            {
                if (Y + Speed + Height > 420)
                {
                    ChangeDirection(); return;
                }
            }
            else if (Dir == Direction.Left)
            {
                if (X - Speed < 0)
                {
                    ChangeDirection(); return;
                }
            }
            else if (Dir == Direction.Right)
            {
                if (X + Speed + Height > 390)
                {
                    ChangeDirection(); return;
                }
            }
            //碰撞
            Rectangle rect = GetRectangle();
            switch (this.Dir)
            {
                case Direction.Up:
                    rect.Y -= this.Speed; break;
                case Direction.Down:
                    rect.Y += this.Speed; break;
                case Direction.Left:
                    rect.X -= this.Speed; break;
                case Direction.Right:
                    rect.X += this.Speed; break;
            }
            if (GameObjectManager.IsCollidedWall(rect) != null)
            {
                ChangeDirection(); return;
            }
            if (GameObjectManager.IsCollidedSteel(rect) != null)
            {
                ChangeDirection(); return;
            }
            if (GameObjectManager.IsCollidedBoss(rect))
            {
                ChangeDirection(); return;
            }
        }

        private void Attack()
        {
            int x = this.X;
            int y = this.Y;
            switch (Dir)
            {
                case Direction.Up:
                    x = x + Width / 2;
                    break;
                case Direction.Down:
                    x = x + Width / 2;
                    y += Height;
                    break;
                case Direction.Left:
                    y = y + Height / 2;
                    break;
                case Direction.Right:
                    x += Width;
                    y = y + Height / 2;
                    break;
            }

            GameObjectManager.CreateBullet(x, y, Dir, Tag.EnemyTank);
        }
        private void AttackCheck()
        {
            attackCount++;
            if (attackCount < AttackSpeed) return;
            Attack();
            attackCount = 0;
        }

        private void AutoChangeDirection()
        {
            changeDirCount++;
            if (changeDirCount < ChangeDirSpeed) return;
            ChangeDirection();
            changeDirCount = 0;
        }
    }
}
