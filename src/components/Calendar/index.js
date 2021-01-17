import React from 'react';
import moment from 'moment';
import './calendar.css';

export default class Calendar extends React.Component {
  state = {
    dateContext: moment(),
    today: moment,
    showMonthPopup: false,
    showYearPopup: false
  }
  constructor(props) {
    super(props);
    this.width = props.width || "500px";
    this.style = props.style || {};
    this.style.width = this.width;
  }
  weekdays = moment.weekdays();
  weekdaysShort = moment.weekdaysShort();
  months = moment.months();

  year = () => {
    return this.state.dateContext.format("Y");
  }
  month = () => {
    return this.state.dateContext.format("MMMM");
  }
  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  }
  currentDate = () => {
    return this.state.dateContext.get("date");
  }
  currentDay = () => {
    return this.state.dateContext.format("D");
  }

  daysInPrevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "month");
    return dateContext.daysInMonth();
  }

  firstDayOfMonth = () => {
    let dateContext = this.state.dateContext;
    let firstDay = moment(dateContext).startOf('month').format('d');
    return firstDay;
  }

  setMonth = (month) => {
    let monthNo = this.months.indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("month", monthNo);
    this.setState({
      dateContext: dateContext
    });
  }

  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "month");
    this.setState({
      dateContext: dateContext
    });
    this.props.onNextMonth && this.props.onNextMonth();
  }

  prevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "month");
    this.setState({
      dateContext: dateContext
    });
    this.props.onPrevMonth && this.props.onPrevMonth();
  }

  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  }
  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a href="#" onClick={(e) => {this.onSelectChange(e, data)}}>
            {data}
          </a>
        </div>
      );
    });
    return (
      <div className="month-popup">
        {popup}
      </div>
    )
  }

  onChangeMonth = (e, month) => {
    this.setState({
      showMonthPopup: ! this.state.showMonthPopup
    })
  }
  
  monthNav = () => {
    return (
      <span className="label-month"
            onClick={(e) => {this.onChangeMonth(e, this.month())}}>
        {this.month()}
        {this.state.showMonthPopup &&
        <this.SelectList data={this.months} />
        }
      </span>
    )
  }
  showYearEditor = () => {
    this.setState({
      showYearNav: true
    });
  }

  setYear = (year) => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("year", year);
    this.setState({
      dateContext: dateContext
    });
  }

  onYearChange = (e) => {
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.targetValue);
  }

  onKeyUpYear = (e) => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({
        showYearNav: false
      });
    }
  }

  yearNav = () => {
    return (
      this.state.showYearNav ?
      <input defaultValue={this.year()}
             className="editor-year"
             ref={(yearInput) => {this.yearInput = yearInput}}
             onKeyUp={(e) => this.onKeyUpYear(e)}
             onChange={(e) => this.onYearChange(e)}
             type="number"
             placeholder="year"
      />
      :
      <span className="label-year"
            onDoubleClick={(e) => {this.showYearEditor()}}>
        {this.year()}
      </span>
    )
  }

  onDayClick = (e, day) => {
    this.props.onDayClick && this.props.onDayClick(e, day)
  }

  
  
  render() {
    // let populateDay = (date) => {
    //   this.props.PTLI && this.props.PTLI.forEach((item, i) => {
    //     let dateContext = Object.assign({}, this.state.dateContext);
    //     dateContext = moment(dateContext).set("date", date);
    //     if (date.isBetween(this.props.PTLI.start, this.props.PTLI.end, undefined, '[]')) {
    //       eventsOfDate.push(
    //         <div className="event">event</div>
    //       )
    //     }
    //   });
    //   return eventsOfDate;
    // }
    let weekdays = this.weekdaysShort.map((day) => {
      return (
        <div className="day">{day}</div>
      )
    })

    let blanks = [];
    let daysInPrevMonthCounter = this.daysInPrevMonth();
    for (let i = this.firstDayOfMonth() - 1; i >= 0; i--) {
      blanks.push(
      <div className="lastMonth">
        {daysInPrevMonthCounter - i}
      </div>
      );
    }

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      this.props.PTLI && this.props.PTLI.forEach((item, i) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("date", d);
      });
      daysInMonth.push(
          <span>{d}</span>
      );
    }
    
    var totalSlots = [...blanks, ...daysInMonth];

    let gridElems = totalSlots.map((d) => {
      return (
        <div className="day">
          {d}
        </div>
      )
    });

    return (
      <div className="calendar-container">
        <table className="calendar">
          <thead>
            <tr className="calendar-header">
              <td colSpan="5">
                <this.monthNav />
                {" "}
                <this.yearNav />
              </td>
              <td colSpan="2" className="nav-month">
                <i className="prev fa fa-fw fa-chevron-left"
                onClick={(e) => this.prevMonth()}></i>
                <i className="prev fa fa-fw fa-chevron-right"
                onClick={(e) => this.nextMonth()}></i>
              </td>
            </tr>
          </thead>
        </table>
        <div className="calendar-gridlayout">
          {weekdays}
          {gridElems}
        </div>
      </div>
    );
  }
}