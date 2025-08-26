using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library_Management_ver1._2
{
    public class LoginVM
    {
        private LoginModel _loginModel;
        public LoginModel loginModel
        {
            get { return _loginModel; }
            set { _loginModel = value; }
        }
    }
}
