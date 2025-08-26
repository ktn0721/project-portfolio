using System.Collections.Specialized;
using System.ComponentModel;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Library_Management
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        LoginModel loginModel;

        public MainWindow()
        {
            InitializeComponent();

            loginModel = new LoginModel();
            loginModel.UserName = "admin";

            //​​将当前窗口（或用户控件）类自身的实例设置为它的数据上下文
            this.DataContext = loginModel;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {

            if(loginModel.UserName == "admin" && loginModel.Password == "123456")
            {
                //弹出新界面
                Index index = new Index();
                index.Show();

                //隐藏当前界面
                this.Hide();
            }
            else
            {
                MessageBox.Show("输入的用户名或密码不正确");
                loginModel.UserName = "";
                loginModel.Password = "";
            }
        }
    }

    public class LoginModel : INotifyPropertyChanged
    {
        //固定写法，使属性变化通知界面
        public event PropertyChangedEventHandler PropertyChanged;
        private void RaisePropertyChanged(string propertyName)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(propertyName));
            }
        }
        private string _UserName;
        public string UserName
        {
            get { return _UserName; }
            set
            {
                _UserName = value;
                RaisePropertyChanged("UserName");
            }
        }
        private string _Password;
        public string Password
        {
            get { return _Password; }
            set
            {
                _Password = value;
                RaisePropertyChanged("Password");
            }
        }
    }
}