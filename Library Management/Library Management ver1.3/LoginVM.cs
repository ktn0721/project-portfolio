using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library_Management_ver1._3
{
    public class LoginVM : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        private void RaisePropertyChanged(string propertyName)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        //private LoginModel _loginModel;
        //public LoginModel loginModel
        //{
        //    get
        //    { 
        //        if(_loginModel == null) _loginModel = new LoginModel();
        //        return _loginModel;
        //    }
        //    set 
        //    {
        //        _loginModel = value;
        //        RaisePropertyChanged("loginModel");
        //    }
        //}

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
    }
}
