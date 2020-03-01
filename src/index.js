import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pagination from 'mf-react-paginator'


import styles from './styles.css'

export default class CsvToTable extends Component {
  static propTypes = {
    csv: PropTypes.object,
    separator: PropTypes.string,
    perPage: PropTypes.number,
    hasHead: PropTypes.bool,
    pageRangeDisplayed: PropTypes.number,
    prevPageText: PropTypes.string,
    firstPageText: PropTypes.string,
    nextPageText: PropTypes.string,
    lastPageText: PropTypes.string,
    innerClass: PropTypes.string,
    paginatorInnerClass: PropTypes.string,
    itemClass: PropTypes.string,
    linkClass: PropTypes.string,
    activeClass: PropTypes.string,
    disabledClass: PropTypes.string,
  }

  static defaultProps = {
    separator: ',',
    perPage: 15,
    hasHead: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      displayCsvData: [],
      csvHead: null,
      csvData: null,
      pagination: null
    } 
  }

  componentDidMount() {
    this.handleFile();
  }

  handleFile() {
    const { csv } = this.props;
    const reader = new FileReader();
    reader.onload = () => {
      this.parseCsvData(reader.result)
    }
    reader.readAsText(csv);
  }

  parseCsvData(data){
    const dataFomatted = data.replace(/\s*[\r\n]"/gm, '"\n').replace(/^\s*[\r\n]/gm, '');
    
    const rows = dataFomatted.split('\n');
    let csvData = [];
  
    rows.forEach(row => {
      csvData.push(row.split(this.props.separator));
    });

    this.setState({
      csvHead: this.props.hasHead ? csvData[0] : null,
      csvData: this.props.hasHead ? csvData.slice(1) : csvData.slice()
    });

    setTimeout(() => {
      this.showCsvData(1);
    }, 500)
  }

  showCsvData(page) {
    if (this.state.csvData) {
      const total = this.state.csvData.length;
      const last = total / this.props.perPage;
      const totalByPage = page * this.props.perPage;

      if (page >= 1 && page <= last) {
        const start = totalByPage - this.props.perPage;
        const max = totalByPage > total ? start + (totalByPage - total) : totalByPage;
        let displayCsvData = [];

        for (let index = start; index < max; index++) {
          displayCsvData.push(this.state.csvData[index]);
        }

        this.setState({
          pagination: {
            perPage: this.props.perPage,
            current: page,
            prev: page > 1,
            next: total > 1 && page < (last),
            last: last,
            total: total,
          },
          displayCsvData: displayCsvData
        });
      }
    }
  }

  render() {
    const {
      title,
      pageRangeDisplayed,
      prevPageText,
      firstPageText,
      nextPageText,
      lastPageText,
      innerClass,
      paginatorInnerClass,
      itemClass,
      linkClass,
      activeClass,
      disabledClass
    } = this.props;

    return (
      <React.Fragment>
        {this.props.csv && 
          <div className={`mf-react-csv-to-table ${innerClass || ''}`}>
            {title && <h3>{title}</h3>}
            <div className="table-responsive">
              <table className="table">
                {this.props.hasHead && this.state.csvHead &&
                <thead>
                  <tr>
                    {this.state.csvHead.map((head, h) => {
                      return (
                        <th key={'head-'+h}>
                          {head}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                }
                <tbody>
                  {this.state.displayCsvData.map((row, i) => {
                    return (
                      <tr key={'row-'+i}>
                        {row.map((col, j) => {
                          return (
                            <td key={'col-'+j}>
                              {col}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className={styles.paginator}>
                {this.state.pagination && 
                  <Pagination 
                    onClick={this.showCsvData.bind(this)}
                    options={this.state.pagination} 
                    pageRangeDisplayed={pageRangeDisplayed}              
                    prevPageText={prevPageText}           
                    firstPageText={firstPageText}    
                    nextPageText={nextPageText}          
                    lastPageText={lastPageText}      
                    innerClass={paginatorInnerClass}              
                    itemClass={itemClass}               
                    linkClass={linkClass}               
                    activeClass={activeClass}              
                    disabledClass={disabledClass}          
                  />
                }
              </div>
            </div>
          </div>
        }
      </React.Fragment>
    )
  }
}
