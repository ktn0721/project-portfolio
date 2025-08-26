using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows;

namespace Library_Management_ver1._5
{
    public class LoginVM : INotifyPropertyChanged
    {
        private MainWindow _main;
        public LoginVM(MainWindow main)
        {
            _main = main;
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void RaisePropertyChanged(string propertyName)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        private LoginModel _loginModel = new LoginModel();
        public string UserName
        {
            get { return _loginModel.UserName; }
            set
            {
                _loginModel.UserName = value;
                RaisePropertyChanged("UserName");
            }
        }
        public string Password
        {
            get { return _loginModel.Password; }
            set
            {
                _loginModel.Password = value;
                RaisePropertyChanged("Password");
            }
        }

        void LoginFunc()
        {
            if (UserName == "admin" && Password == "123456")
            {
                //弹出新界面
                Index index = new Index();
                index.Show();

                //取得mainWindow实例
                _main.Hide();
            }
            else
            {
                MessageBox.Show("输入的用户名或密码不正确");
                UserName = "";
                Password = "";
            }
        }

        bool CanLoginExecute()
        {
            return true;
        }

        //命令 绑定到登录按钮上
        public ICommand LoginAction
        {
            get
            {
                return new RelayCommond(LoginFunc, CanLoginExecute);
            }
        }
    }
}
