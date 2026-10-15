import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

window.NailNative = {
  isNative: () => Capacitor.isNativePlatform(),
  async pickPhoto(source) {
    const photo = source === 'camera'
      ? await Camera.takePhoto({ quality: 80, saveToGallery: false })
      : (await Camera.chooseFromGallery({ quality: 80, allowMultipleSelection: false })).results[0];
    if (!photo) return null;
    const response = await fetch(photo.webPath || Capacitor.convertFileSrc(photo.uri));
    if (!response.ok) throw new Error('无法读取照片');
    return await response.blob();
  },
  async exportCalendar(content) {
    if (Capacitor.isNativePlatform()) {
      const file = await Filesystem.writeFile({ path: 'nail-care-reminders.ics', data: content, directory: Directory.Cache, encoding: Encoding.UTF8 });
      await Share.share({ title: '护甲日历提醒', files: [file.uri], dialogTitle: '保存或导入日历' });
    } else {
      const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nail-care-reminders.ics';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  }
};
