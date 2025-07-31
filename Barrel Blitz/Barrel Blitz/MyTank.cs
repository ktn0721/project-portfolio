using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace __Barrel_Blitz_
{
    internal class MyTank : MoveThing
    {
        public bool isMoving { get; set; }
        public int HP { get; set; }
        private int originalX;
        private int originalY;

        public MyTank(int x, int y, int speed)
        {
            this.X = x;
            this.Y = y;
            originalX = x;
            originalY = y;
            this.Speed = speed;
            this.BitmapUp = Properties.Resources.MyTankUp;
            this.BitmapDown = Properties.Resources.MyTankDown;
            this.BitmapLeft = Properties.Resources.MyTankLeft;
            this.BitmapRight = Properties.Resources.MyTankRight;
            this.Dir = Direction.Up;
            isMoving = false;
            HP = 4;
        }

        //发射子弹
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

            GameObjectManager.CreateBullet(x, y, Dir, Tag.MyTank);
            SoundManager.PlayFire();
        }

        public void KeyDown(KeyEventArgs args)
        {
            switch (args.KeyCode)
            {
                case Keys.Up:
                    Dir = Direction.Up;
                    isMoving = true;
                    break;
                case Keys.Down:
                    Dir = Direction.Down;
                    isMoving = true;
                    break;
                case Keys.Left:
                    Dir = Direction.Left;
                    isMoving = true;
                    break;
                case Keys.Right:
                    Dir = Direction.Right;
                    isMoving = true;
                    break;
                case Keys.Space:
                    //发射子弹
                    Attack();
                    break;
            }
        }
        public void KeyUp(KeyEventArgs args)
        {
            switch (args.KeyCode)
            {
                case Keys.Up:
                    isMoving = false;
                    break;
                case Keys.Down:
                    isMoving = false;
                    break;
                case Keys.Left:
                    isMoving = false;
                    break;
                case Keys.Right:
                    isMoving = false;
                    break;
            }
        }

        public override void Update()
        {
            MoveCheck();//移动检查
            Move();

            base.Update();
        }
        private void Move()
        {
            if (isMoving == false) return;
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
                    isMoving = false; return;
                }
            }
            else if (Dir == Direction.Down)
            {
                if (Y + Speed + Height > 420)
                {
                    isMoving = false; return;
                }
            }
            else if (Dir == Direction.Left)
            {
                if (X - Speed < 0)
                {
                    isMoving = false; return;
                }
            }
            else if (Dir == Direction.Right)
            {
                if (X + Speed + Height > 390)
                {
                    isMoving = false; return;
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
                isMoving = false; return;
            }
            if (GameObjectManager.IsCollidedSteel(rect) != null)
            {
                isMoving = false; return;
            }
            if (GameObjectManager.IsCollidedBoss(rect))
            {
                isMoving = false; return;
            }
        }

        public void TakeDamage()
        {
            HP--;
            if(HP <= 0)
            {
                X = originalX;
                Y = originalY;
                HP = 4;
            }
        }
    }
}
