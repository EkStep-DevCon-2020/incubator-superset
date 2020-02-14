/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { 
  Popover,
  OverlayTrigger,
  Button,
  Modal,
  Row,
  Col,
  FormControl,
  FormGroup, } from 'react-bootstrap';
import { t } from '@superset-ui/translation';
import { SupersetClient } from '@superset-ui/connection';

import CopyToClipboard from './../../components/CopyToClipboard';
import ModalTrigger from './../../components/ModalTrigger';
import { getExploreLongUrl } from '../exploreUtils';

const propTypes = {
  slice: PropTypes.object,
};

export default class PublishChartButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      name: " ",
      description: " ",
      x_axis_label: " ",
      y_axis_label: " ",
    };
  }

  handleInputChange(e) {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    const data = {};
    data[name] = value;
    this.setState(data);
  }

  // componentWillMount(){
  //   SupersetClient.get({
  //     url: "/superset/chart_config",
  //   }).then(({ json }) => {
  //     console.log(json)
  //   }).catch(() =>
  //     console.log("asdasd")
  //   );
  // }

  publishChart = () => {
    const { slice } = this.props
    const {
      name,
      description,
      x_axis_label,
      y_axis_label
    } = this.state
    SupersetClient.post({
      url: "/superset/publish_chart",
      postPayload: { form_data: slice.form_data, chart_data: { name, description, x_axis_label, y_axis_label } },
    }).then(({ json }) => {
      console.log(json)
    }).catch(() =>
      console.log("asdasd")
    );
  }

  renderQueryModalBody(){
    const { submitting, name, description, x_axis_label, y_axis_label } = this.state
    return (
      <div>
        <Row>
          <Col md={6}>
            <FormGroup>
              <label className="control-label" htmlFor="name">
                {t('Name')}
              </label>
              <FormControl
                name="name"
                type="text"
                bsSize="sm"
                value={name}
                onChange={event => this.handleInputChange(event)}
              />
            </FormGroup>
            <FormGroup>
              <label className="control-label" htmlFor="description">
                {t('Description')}
              </label>
              <FormControl
                name="description"
                type="text"
                componentClass="textarea"
                bsSize="sm"
                value={description}
                onChange={event => this.handleInputChange(event)}
                style={{ maxWidth: '100%' }}
              />
              <p className="help-block">
                {t(
                  'The description will be displayed in the portal dashboard.',
                )}
              </p>
            </FormGroup>
            <FormGroup>
              <label className="control-label" htmlFor="x_axis_label">
                {t('X-Axis Label')}
              </label>
              <FormControl
                name="x_axis_label"
                type="text"
                bsSize="sm"
                value={x_axis_label}
                onChange={event => this.handleInputChange(event)}
              />
            </FormGroup>
            <FormGroup>
              <label className="control-label" htmlFor="y_axis_label">
                {t('Y-Axis Label')}
              </label>
              <FormControl
                name="y_axis_label"
                type="text"
                bsSize="sm"
                value={y_axis_label}
                onChange={event => this.handleInputChange(event)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button
          onClick={this.publishChart}
          type="button"
          bsSize="sm"
          bsStyle="primary"
          className="m-r-5"
          disabled={submitting}
        >
          {t('Submit')}
        </Button>
      </div>
    )
  }
  render() {
    return (
      <ModalTrigger
        isButton
        animation={this.props.animation}
        triggerNode={<span>{t('Publish')}</span>}
        modalTitle={t('Publish chart to portal dashboard')}
        bsSize="large"
        modalBody={this.renderQueryModalBody()}
      />
    );
  }
}

PublishChartButton.propTypes = propTypes;
