import React, { FunctionComponent, useRef, useState } from 'react';
import { Field, FieldProps } from 'formik';
import { Grid, MenuItem, Select, SelectChangeEvent, Slider } from '@mui/material';
import SimpleTextField from './SimpleTextField';
import { SubscriptionFocus } from './Subscription';
import { buildScaleLevel, useLevel } from '../utils/hooks/useScale';

interface InputScaleFieldProps {
  label: string;
  onSubmit?: (name: string, value: string | number | number[]) => void;
  onFocus?: (name: string, value: string) => void;
  editContext?:
  | readonly ({
    readonly focusOn: string | null;
    readonly name: string;
  } | null)[]
  | null;
  containerStyle?: Record<string, string | number>;
  entityType: string;
  attributeName: string;
  disabled?: boolean;
  maxLimit?: number;
}

const InputScaleField: FunctionComponent<InputScaleFieldProps & FieldProps> = ({
  form: { setFieldValue },
  field: { name, value },
  label,
  onFocus,
  onSubmit,
  editContext,
  containerStyle,
  entityType,
  attributeName,
  disabled,
  maxLimit,
}) => {
  const {
    level: { color },
    marks: defaultMarks,
    scale,
  } = useLevel(entityType, attributeName, value);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceInterval = 200;
  const min = scale?.min ? scale.min.value : 0;
  const defaultMaxValue = scale?.max ? scale.max.value : 0;
  const max = maxLimit !== undefined && Number.isFinite(maxLimit) && maxLimit <= defaultMaxValue
    ? maxLimit
    : defaultMaxValue;
  const marks = defaultMarks.filter((mark) => mark.value <= max);
  const sliderStyle = {
    color,
    '& .MuiSlider-rail': {
      background: `${color}`,
    },
  };
  const handleSliderChange = (event: SelectChangeEvent) => {
    setFieldValue(name, event.target.value);
    onSubmit?.(name, event.target.value);
  };

  const handleInputChange = (_: string, v: string) => {
    const inputValue = parseInt(v, 10);

    if (!Number.isNaN(inputValue)) {
      const clampedValue = Math.min(Math.max(inputValue, min), max);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setFieldValue(name, clampedValue.toString());
        onSubmit?.(name, clampedValue.toString());
      }, debounceInterval);
    } else {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        setFieldValue(name, '0');
        onSubmit?.(name, '0');
      }, debounceInterval);
    }
  };

  const currentLevel = buildScaleLevel(value, scale);

  const [initialValue] = useState(value);
  const finalDisabled = disabled === true || disabled === false ? disabled : initialValue > max;

  return (
    <>
      <Grid container={true} spacing={3} style={containerStyle}>
        <Grid item xs={6}>
          <Field
            component={SimpleTextField}
            fullWidth
            type="number"
            name={name}
            label={label}
            onSubmit={onSubmit}
            onFocus={onFocus}
            disabled={finalDisabled}
            onChange={handleInputChange}
            helpertext={
              editContext ? <SubscriptionFocus context={editContext} fieldName={name} /> : undefined
              }
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            fullWidth
            labelId={name}
            value={currentLevel.level.value?.toString() ?? ''}
            onChange={handleSliderChange}
            disabled={finalDisabled}
            sx={{ marginTop: 2 }}
          >
            {marks.map((mark, i: number) => {
              return (
                <MenuItem
                  key={i}
                  value={mark.value.toString()}
                >
                  {mark.label}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
      <Slider
        value={typeof value === 'string' ? parseInt(value, 10) : value ?? 0}
        min={min}
        max={max}
        onChange={(_, v) => setFieldValue(name, v.toString())}
        onChangeCommitted={(_, v) => onSubmit?.(name, v.toString())}
        sx={sliderStyle}
        style={{ margin: '5px 0 0 0' }}
        valueLabelDisplay={editContext ? 'off' : 'auto'}
        size="small"
        valueLabelFormat={() => currentLevel.level.label}
        disabled={finalDisabled}
      />
    </>
  );
};

export default InputScaleField;
