import { dateUtil } from '@app/shared';
import { showToast } from 'vant';
import { onMounted, reactive } from 'vue';

export function usePicker() {
  const model = reactive<{
    show: boolean;
    type: 'satrt' | 'end';
    title: string;
    maxDate?: Date;
    minDate?: Date;
    minTime?: number | string;
    maxTime?: number | string;
    currentDate: string[];
    currentTime: string[];
    startDate: string;
    endDate: string;
  }>({
    show: false,
    type: 'satrt',
    title: '开始时间',
    maxDate: undefined,
    minDate: undefined,
    minTime: undefined,
    maxTime: undefined,
    currentDate: [],
    currentTime: [],
    startDate: '',
    endDate: '',
  });

  onMounted(() => {
    initDefaults();
  });

  function initDefaults() {
    const date = dateUtil();
    const startDate = date.format('YYYY-MM-DD 00:00');
    const endDate = dateUtil(startDate).add(4, 'hour').format('YYYY-MM-DD HH:00');
    model.startDate = startDate;
    model.endDate = endDate;
  }

  function handlePickerConfirm() {
    model.show = false;
    const date = model.currentDate.join('-');
    const current = dateUtil(`${date} ${model.currentTime}`).format('YYYY-MM-DD HH:00');
    if (model.type === 'satrt') {
      model.endDate = '';
      model.startDate = current;
    } else {
      model.endDate = current;
    }
  }

  function handleOpenStartDatePick() {
    const date = dateUtil(model.startDate).format('YYYY-MM-DD') || dateUtil().format('YYYY-MM-DD');

    model.maxTime = undefined;
    model.minDate = undefined;

    model.title = '开始时间';
    model.type = 'satrt';
    model.maxDate = new Date();
    model.minTime = '00';
    model.currentDate = date.split('-');
    model.currentTime = [dateUtil(date).hour().toString()];
    model.show = true;
  }

  function handleOpenEndDatePick() {
    if (!model.startDate) {
      showToast('请先选择开始时间');
      return;
    }
    const date = dateUtil(model.startDate);
    const maxDate = date.add(4, 'hour');
    const maxDates = maxDate.format('YYYY-MM-DD').split('-');

    const minDate = date;
    const minDates = minDate.format('YYYY-MM-DD').split('-');

    model.title = '结束时间';
    model.type = 'end';
    model.maxDate = new Date(Number(maxDates[0]), Number(maxDates[1]) - 1, Number(maxDates[2]));
    model.minDate = new Date(Number(minDates[0]), Number(minDates[1]) - 1, Number(minDates[2]));
    model.maxTime = maxDate.hour();
    if (Number(maxDates[2]) === Number(minDates[2])) {
      model.minTime = date.hour() + 1;
    } else {
      model.minTime = undefined;
    }
    model.currentDate = maxDates;
    model.currentTime = [maxDate.hour().toString()];
    model.show = true;
  }

  function handlePicker({ selectedValues, columnIndex }) {
    if (columnIndex === 2 && model.type === 'end') {
      const startDate = dateUtil(model.startDate);
      const maxDate = startDate.add(4, 'hour');
      const current = selectedValues.join('-');
      const hasAfter = maxDate.isAfter(current, 'day');

      if (hasAfter) {
        model.maxTime = undefined;
        model.minTime = startDate.hour() + 1;
      } else {
        model.minTime = undefined;
        model.maxTime = maxDate.hour();
      }
    }
  }

  return {
    model,
    handlePicker,
    handleOpenEndDatePick,
    handleOpenStartDatePick,
    handlePickerConfirm,
  };
}
