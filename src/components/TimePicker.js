import React, { useEffect, useRef } from 'react';

const TimePicker = ({
  value,
  TimepickerClassName,
  isRtl,
  colorPrimary,
  colorPrimaryLight,
  slideAnimationDuration,
  handleMinuteChange,
  handleHourChange,
  selectedTimeClassName,
}) => {
  const selectedTimeRef = useRef(null);

  const isSelected = (index, type) => {
    switch (type) {
      case 'hour':
        return value && value.hour === index;
      case 'minute':
        return value && value.minute === index;
      default:
        return false;
    }
  };

  const getSelectedTimeClass = (index, type) => {
    if (value && value.day) {
      if (isSelected(index, type)) {
        return `Timepicker__time  -ltr ${selectedTimeClassName} -selected`;
      }
      return `Timepicker__time -ltr ${selectedTimeClassName}`;
    }
    return `Timepicker__time Timepicker_disabled -ltr ${selectedTimeClassName}`;
  };

  useEffect(() => {
    const listNode = selectedTimeRef.current;
    const selectedHour = listNode.querySelectorAll('#selected_hour');
    const selectedMinute = listNode.querySelectorAll('#selected_minute');
    if (selectedMinute.length > 0) {
      selectedMinute[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'center',
        alignToTop: true,
      });
    }

    if (selectedHour.length > 0) {
      selectedHour[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'center',
        alignToTop: true,
      });
    }
  }, []);

  return (
    <div
      className={`TimeSelect Calendar -noFocusOutline ${TimepickerClassName} -${
        isRtl ? 'rtl' : 'ltr'
      }`}
      role="grid"
      style={{
        '--cl-color-primary': colorPrimary,
        '--cl-color-primary-light': colorPrimaryLight,
        '--animation-duration': slideAnimationDuration,
      }}
    >
      <div className="Timepicker_header">
        <div>HH</div>
        <div>MM</div>
      </div>
      <div className="Timepicker_hour_minutes" ref={selectedTimeRef}>
        <div className="Timepicker_hour">
          {Array(24)
            .fill(1)
            .map((_, index) => {
              return (
                <div
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={index}
                  role="none"
                  className={getSelectedTimeClass(index, 'hour')}
                  id={isSelected(index, 'hour') ? 'selected_hour' : ''}
                  onClick={() => handleHourChange(index)}
                >
                  {index.toString().padStart(2, '0')}
                </div>
              );
            })}
        </div>
        <div className="Timepicker_minute">
          {Array(60)
            .fill(1)
            .map((_, index) => {
              return (
                <div
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={index}
                  role="none"
                  className={getSelectedTimeClass(index, 'minute')}
                  id={isSelected(index, 'hour') ? 'selected_minute' : ''}
                  onClick={() => handleMinuteChange(index)}
                >
                  {index.toString().padStart(2, '0')}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
