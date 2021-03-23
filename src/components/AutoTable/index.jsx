import { Row, Col } from 'antd';
import Mcard from './mcard';
import Mtable from './mtable';

const col = { xs: 0, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  cols = { xs: 24, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0 };

export default (props) => {
  return <Row style={{height:"100%"}}>
    <Col {...col} style={{height:"100%"}}>
      <Mtable {...props} />
    </Col>
    <Col {...cols} style={{height:"100%"}}>
      <Mcard {...props} />
    </Col>
  </Row>
}