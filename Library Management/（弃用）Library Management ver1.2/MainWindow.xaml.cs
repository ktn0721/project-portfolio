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

namespace Library_Management_ver1._2
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        LoginVM loginVM;

        public MainWindow()
        {
            InitializeComponent();

            loginVM = new LoginVM();

            //​​将当前窗口（或用户控件）类自身的实例设置为它的数据上下文
            this.DataContext = loginVM;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {

            if(loginVM.loginModel.UserName == "admin" && loginVM.loginModel.Password == "123456")
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
                loginVM.loginModel.UserName = "";
                loginVM.loginModel.Password = "";
            }
        }
    }
}