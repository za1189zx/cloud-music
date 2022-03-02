import { Row, Col, Button, Menu, Carousel, Modal, Form, Select, Input, Checkbox, BackTop, Pagination } from 'ant-design-vue'

export const antD = {
  install: Vue => {
    Vue.use(Row)
      .use(Col)
      .use(Button)
      .use(Menu)
      .use(Carousel)
      .use(Modal)
      .use(Form)
      .use(Select)
      .use(Input)
      .use(Checkbox)
      .use(BackTop)
      .use(Pagination)
  }
}
