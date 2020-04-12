import Vue from 'vue'
import {
  Aside,
  Button,
  Container,
  Form,
  FormItem,
  Header,
  Input,
  Main,
  Message,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  MessageBox,
  Tree,
  Option,
  Select,
  Cascader,
  Tabs,
  TabPane
} from "element-ui";

Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Option);
Vue.use(Select);
Vue.use(Cascader);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
