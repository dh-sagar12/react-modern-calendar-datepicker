import React, { useState, useRef, useEffect } from 'react';

import { getDateAccordingToMonth, shallowClone, getValueType } from './shared/generalUtils';
import {
  TYPE_SINGLE_DATE,
  TYPE_RANGE,
  TYPE_MUTLI_DATE,
  TYPE_TIME_SELECT_SINGLE_DATE,
} from './shared/constants';
import { useLocaleUtils, useLocaleLanguage } from './shared/hooks';

import { Header, MonthSelector, YearSelector, DaysList, TimePicker } from './components';

const Calendar = ({
  value,
  onChange,
  onDisabledDayError,
  calendarClassName = '',
  calendarTodayClassName,
  calendarSelectedDayClassName,
  calendarRangeStartClassName,
  calendarRangeBetweenClassName,
  calendarRangeEndClassName,
  disabledDays,
  colorPrimary = '#0eca2d',
  colorPrimaryLight = '#cff4d5',
  slideAnimationDuration = '0.4s',
  minimumDate = null,
  maximumDate = null,
  selectorStartingYear,
  selectorEndingYear,
  locale = 'en',
  shouldHighlightWeekends,
  renderFooter = () => null,
  customDaysClassName = [],
  TimepickerClassName,
  showTimeSelect,
  selectedTimeClassName,
}) => {
  const calendarElement = useRef(null);
  const [mainState, setMainState] = useState({
    activeDate: null,
    monthChangeDirection: '',
    isMonthSelectorOpen: false,
    isYearSelectorOpen: false,
  });

  useEffect(() => {
    const handleKeyUp = ({ key }) => {
      /* istanbul ignore else */
      if (key === 'Tab') calendarElement.current.classList.remove('-noFocusOutline');
    };
    calendarElement.current.addEventListener('keyup', handleKeyUp, false);
    return () => {
      if (calendarElement.current !== null) {
        calendarElement.current.removeEventListener('keyup', handleKeyUp, false);
      }
    };
  });

  const { getToday } = useLocaleUtils(locale);
  const { weekDays: weekDaysList, isRtl } = useLocaleLanguage(locale);
  const today = getToday();

  const createStateToggler = property => () => {
    setMainState({ ...mainState, [property]: !mainState[property] });
  };

  const toggleMonthSelector = createStateToggler('isMonthSelectorOpen');
  const toggleYearSelector = createStateToggler('isYearSelectorOpen');

  const getComputedActiveDate = () => {
    const valueType = getValueType(value, showTimeSelect);
    if (valueType === TYPE_MUTLI_DATE && value.length) return shallowClone(value[0]);
    if (valueType === (TYPE_SINGLE_DATE || TYPE_TIME_SELECT_SINGLE_DATE) && value)
      return shallowClone(value);
    if (valueType === TYPE_RANGE && value.from) return shallowClone(value.from);
    return shallowClone(today);
  };

  const activeDate = mainState.activeDate
    ? shallowClone(mainState.activeDate)
    : getComputedActiveDate();

  const weekdays = weekDaysList.map(weekDay => (
    <abbr key={weekDay.name} title={weekDay.name} className="Calendar__weekDay">
      {weekDay.short}
    </abbr>
  ));

  const handleMonthChange = direction => {
    setMainState({
      ...mainState,
      monthChangeDirection: direction,
    });
  };

  const updateDate = () => {
    setMainState({
      ...mainState,
      activeDate: getDateAccordingToMonth(activeDate, mainState.monthChangeDirection),
      monthChangeDirection: '',
    });
  };

  const selectMonth = newMonthNumber => {
    setMainState({
      ...mainState,
      activeDate: { ...activeDate, month: newMonthNumber },
      isMonthSelectorOpen: false,
    });
  };

  const selectYear = year => {
    setMainState({
      ...mainState,
      activeDate: { ...activeDate, year },
      isYearSelectorOpen: false,
    });
  };

  const handleHourChange = hour => {
    if (value && value.day) {
      setMainState({
        ...mainState,
        activeDate: { ...activeDate, hour },
      });
      onChange({ ...value, hour });
    }
  };

  const handleMinuteChange = minute => {
    if (value && value.day) {
      setMainState({
        ...mainState,
        activeDate: { ...activeDate, minute },
      });
      onChange({ ...value, minute });
    }
  };

  return (
    <div style={{ display: 'flex', boxShadow: '0 1em 4em rgba(0, 0, 0, 0.07)' }}>
      <div
        className={`Calendar -noFocusOutline ${calendarClassName} -${isRtl ? 'rtl' : 'ltr'}`}
        role="grid"
        style={{
          '--cl-color-primary': colorPrimary,
          '--cl-color-primary-light': colorPrimaryLight,
          '--animation-duration': slideAnimationDuration,
        }}
        ref={calendarElement}
      >
        <Header
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          activeDate={activeDate}
          onMonthChange={handleMonthChange}
          onMonthSelect={toggleMonthSelector}
          onYearSelect={toggleYearSelector}
          monthChangeDirection={mainState.monthChangeDirection}
          isMonthSelectorOpen={mainState.isMonthSelectorOpen}
          isYearSelectorOpen={mainState.isYearSelectorOpen}
          locale={locale}
          showTimeSelect={showTimeSelect}
        />

        <MonthSelector
          isOpen={mainState.isMonthSelectorOpen}
          activeDate={activeDate}
          onMonthSelect={selectMonth}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          locale={locale}
        />

        <YearSelector
          isOpen={mainState.isYearSelectorOpen}
          activeDate={activeDate}
          onYearSelect={selectYear}
          selectorStartingYear={selectorStartingYear}
          selectorEndingYear={selectorEndingYear}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          locale={locale}
        />

        <div className="Calendar__weekDays">{weekdays}</div>

        <DaysList
          activeDate={activeDate}
          value={value}
          monthChangeDirection={mainState.monthChangeDirection}
          onSlideChange={updateDate}
          disabledDays={disabledDays}
          onDisabledDayError={onDisabledDayError}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={onChange}
          calendarTodayClassName={calendarTodayClassName}
          calendarSelectedDayClassName={calendarSelectedDayClassName}
          calendarRangeStartClassName={calendarRangeStartClassName}
          calendarRangeEndClassName={calendarRangeEndClassName}
          calendarRangeBetweenClassName={calendarRangeBetweenClassName}
          locale={locale}
          shouldHighlightWeekends={shouldHighlightWeekends}
          customDaysClassName={customDaysClassName}
          isQuickSelectorOpen={mainState.isYearSelectorOpen || mainState.isMonthSelectorOpen}
          showTimeSelect={showTimeSelect}
        />
        <div className="Calendar__footer">{renderFooter()}</div>
      </div>
      {showTimeSelect && (
        <TimePicker
          value={value}
          onChange={onChange}
          TimepickerClassName={TimepickerClassName}
          isRtl={isRtl}
          colorPrimary={colorPrimary}
          colorPrimaryLight={colorPrimaryLight}
          slideAnimationDuration={slideAnimationDuration}
          handleHourChange={handleHourChange}
          handleMinuteChange={handleMinuteChange}
          activeDate={activeDate}
          selectedTimeClassName={selectedTimeClassName}
        />
      )}
    </div>
  );
};

export { Calendar };
