import React, { useState, useEffect, ChangeEvent } from "react";
import "../../css/AlarmModal.css";

interface AlarmType {
  id: string;
  title: string;
  time: string;
  description: string;
  frequency: string[];
  sound: boolean;
  active: boolean;
  hasRung?: boolean;
}

interface AlarmModalProps {
  newAlarm: AlarmType;
  setNewAlarm: React.Dispatch<React.SetStateAction<AlarmType>>;
  handleSaveAlarm: () => void;
  handleCloseModal: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFrequencyChange: (day: string) => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
  newAlarm,
  setNewAlarm,
  handleSaveAlarm,
  handleCloseModal,
  handleInputChange,
  handleFrequencyChange,
}) => {
  const [hour, setHour] = useState<number | string>(1);
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("AM");
  const [confirmedTime, setConfirmedTime] = useState<string>("");

  useEffect(() => {
    if (newAlarm.time) {
      const [initialHour, initialMinutePeriod] = newAlarm.time.split(":");
      const [initialMinute, initialPeriod] = initialMinutePeriod.split(" ");
      setHour(parseInt(initialHour, 10));
      setMinute(initialMinute.padStart(2, "0"));
      setPeriod(initialPeriod);
    }
  }, [newAlarm.time]);

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHour = parseInt(e.target.value, 10);
    if (!isNaN(newHour) && newHour >= 1 && newHour <= 12) {
      setHour(newHour);
    } else if (e.target.value === "") {
      setHour(""); // Allow empty value while editing
    }
  };

  const handleHourBlur = () => {
    if (hour === "") {
      setHour(1); // Reset to 1 if input is left empty after clicking out
    }
  };

  const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMinute = e.target.value;
    if (/^\d{0,2}$/.test(newMinute)) {
      setMinute(newMinute);
    }
  };

  const handleMinuteBlur = () => {
    const numericMinute = parseInt(minute, 10);
    if (minute === "") {
      setMinute("00"); // Reset to "00" if input is empty after clicking out
    } else if (!isNaN(numericMinute)) {
      if (numericMinute < 0 || numericMinute > 59) {
        alert("Invalid input. Please enter a value between 0 and 59. \nMinute will be reset to 00."); // Alert for invalid input
        setMinute("00"); // Reset to "00" if the value is invalid
      } else {
        setMinute(numericMinute.toString().padStart(2, "0")); // Pad single digit with zero
      }
    }
  };

  const togglePeriod = () => {
    setPeriod((prevPeriod) => (prevPeriod === "AM" ? "PM" : "AM"));
  };

  const handleSaveTime = () => {
    const finalHour = hour || 1;
    const finalMinute = minute.padStart(2, "0");
    const formattedTime = `${finalHour}:${finalMinute} ${period}`;
    setConfirmedTime(formattedTime);
    setNewAlarm({ ...newAlarm, time: formattedTime });
  };

  const handleSave = () => {
    if (!confirmedTime) {
      alert("Please confirm the alarm time by clicking 'Save Time' before saving.");
      return;
    }

    handleSaveAlarm();
  };

  return (
    <div className="alarm-modal-overlay">
      <div className="alarm-modal">
        <h2 className="alarm-modal-title">Add New Alarm</h2>

        <div className="alarm-modal-field">
          <label className="alarm-modal-label">Alarm Title</label>
          <input
            type="text"
            name="title"
            value={newAlarm.title}
            onChange={(e) => {
              if (e.target.value.length <= 16) {
                handleInputChange(e);
              }
            }}
            className="alarm-modal-input"
            placeholder="Alarm"
          />
          <div className="alarm-title-info">
            <p className="alarm-title-note">16 letters maximum</p>
            <p className="alarm-title-count">{newAlarm.title.length}/16</p>
          </div>
        </div>

        <div className="alarm-modal-field">
          <label className="alarm-modal-label">Alarm Description</label>
          <input
            type="text"
            name="description"
            value={newAlarm.description}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                handleInputChange(e);
              }
            }}
            className="alarm-modal-input"
            placeholder="e.g., Take iron pill, Go for a run, etc."
          />
          <div className="alarm-description-info">
            <p className="alarm-description-count">{newAlarm.description.length}/50</p>
          </div>
        </div>

        <div className="alarm-modal-field">
          <label className="alarm-modal-label">Select Alarm Time</label>
          <div className="alarm-time-selection">
            <input
              type="number"
              value={hour}
              onChange={handleHourChange}
              onBlur={handleHourBlur}
              className="time-value-input"
              min="1"
              max="12"
            />

            <span className="colon-separator">:</span>

            <input
              type="number"
              value={minute}
              onChange={handleMinuteChange}
              onBlur={handleMinuteBlur}
              className="time-value-input"
              min="0"
              max="59"
            />

            <button onClick={togglePeriod} className="period-toggle">
              {period}
            </button>

            <button onClick={handleSaveTime} className="save-time-button">
              Save Time
            </button>
          </div>
          {confirmedTime && (
            <p className="confirmed-time">
              Confirmed Time: {confirmedTime}
            </p>
          )}
        </div>

        <div className="alarm-modal-field">
          <label className="alarm-modal-label">Sound Alarm?</label>
          <div className="alarm-modal-sound-options">
            <label>
              <input
                type="radio"
                name="sound"
                value="true"
                checked={newAlarm.sound === true}
                onChange={() => setNewAlarm({ ...newAlarm, sound: true })}
              />
              Yes
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="sound"
                value="false"
                checked={newAlarm.sound === false}
                onChange={() => setNewAlarm({ ...newAlarm, sound: false })}
              />
              No
            </label>
          </div>
        </div>

        <div className="alarm-modal-field">
          <label className="alarm-modal-label">Alarm Frequency</label>
          <div className="alarm-modal-checkbox-group">
            {["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map((day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={newAlarm.frequency.includes(day)}
                  onChange={() => handleFrequencyChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="alarm-modal-buttons">
          <button
            className="alarm-modal-save-button"
            onClick={handleSave}
            disabled={!confirmedTime}
          >
            Save
          </button>
          {!confirmedTime && (
            <p className="save-time-note">
              Please confirm the alarm time by clicking "Save Time" before saving.
            </p>
          )}
          <button className="alarm-modal-cancel-button" onClick={handleCloseModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
