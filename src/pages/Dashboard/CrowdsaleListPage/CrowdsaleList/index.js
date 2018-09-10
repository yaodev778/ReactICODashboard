import React from 'react'
import { Table, Icon, Input, Button } from 'antd'
import Details from './Details'
import ICOStatus from './ICOStatus'
import axios from 'axios'
import './style.scss'

const defaultPagination = {
  pageSizeOptions: ['10', '50', '100', '250'],
  showSizeChanger: true,
  current: 1,
  size: 'small',
  showTotal: (total: number) => `Total ${total} items`,
  total: 0,
}

class CrowdsaleList extends React.Component {
  state = {
    tableData: null,
    data: null,
    pager: { ...defaultPagination },
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    viewDetails: false,
    viewICOStatus: false,
    address: null,
  }

  componentDidMount() {
    axios.get('/api/v1.0/contract/crowdsale')
      .then((result) => {
        console.log(result);
        if (result.data) {
          this.setState({
            tableData: result.data.contracts,
            data: result.data.contracts,
          })
        }
      });
    }

  handleTableChange = (pagination, filters, sorter) => {
    if (this.state.pager) {
      const pager = { ...this.state.pager }
      if (pager.pageSize !== pagination.pageSize) {
        this.pageSize = pagination.pageSize
        pager.pageSize = pagination.pageSize
        pager.current = 1
      } else {
        pager.current = pagination.current
      }
      this.setState({
        pager: pager,
      })
    }
  }

  handleOnClickDownloadContract = () => {
    axios({
      url: '/ico.sol',
      method: 'GET',
      responseType: 'blob', // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'ico.sol')
      document.body.appendChild(link)
      link.click()
    })
  }

  handleOnClickDetails(address){
    this.setState({address: address, viewDetails: !this.state.viewDetails});
    console.log(this.state.viewDetails);
  }

  handleOnClickICOStatus = () => {
    this.setState({viewICOStatus: !this.state.viewICOStatus})
  }

  render() {
    let { pager, data } = this.state

    const columns = [
      {
        title: 'Token Name',
        dataIndex: 'token_name',
        key: 'token_name',
        render: (text, record) => (record.token_contract.name),
      },
      {
        title: 'Token Symbol',
        dataIndex: 'token_symbol',
        key: 'token_symbol',
        render: (text, record) => (record.token_contract.symbol),
      },
      {
        title: 'Minimum Cap',
        dataIndex: 'min_cap',
        key: 'min_cap',
      },
      {
        title: 'Maximum Cap',
        dataIndex: 'max_cap',
        key: 'max_cap',
      },
      {
        title: 'Token Price',
        dataIndex: 'token_price_wei',
        key: 'token_price_wei',
      },
      {
        title: 'Duration Days',
        dataIndex: 'campaign_duration_days',
        key: 'campaign_duration_days',
      },
      {
        title: 'Network',
        dataIndex: 'network',
        key: 'network',
      },
      {
        title: 'Whitelisting',
        dataIndex: 'is_whitelisting_enabled',
        key: 'is_whitelisting_enabled',
        render: (text, record) => (record.is_whitelisting_enabled ? 'Enabled' : 'Disabled'),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href={`http://${record.network}.etherscan.io/address/${record.contract_address}`} className="mr-2">
              <i className="icmn-eye mr-1" width={16} />
            </a>
            <a href="javascript: void(0);" className="mr-2" onClick={this.handleOnClickDetails}>
              <i className="icmn-list mr-1" width={16} />
            </a>
            <a href="javascript: void(0);" className="mr-2" onClick={this.handleOnClickICOStatus}>
              <i className="icmn-wrench mr-1" width={16} />
            </a>
            <a href="javascript: void(0);" className="mr-2">
              <i className="icmn-quill mr-1" width={16} />
            </a>
          </span>
        ),
      },
    ]

    return (
      <div className="card">

        {
          <div>
          <div className="card-header">
            <div className="utils__title">
              <strong>Crowdsale Contracts List</strong>
            </div>
          </div>
          <div className="card-body">
            <Table
              columns={columns}
              dataSource={data}
              pagination={pager}
              onChange={this.handleTableChange}
            />
          </div>
          </div>
        }
      </div>
    )
  }
}

export default CrowdsaleList
