import { Injectable } from '@angular/core';

export class CreateStudentRequest {
  name: string = null;

  birthday: {
    day: number;
    month: number;
    year: number;
  } = null;

  phoneList: Array<{
    name: string,
    phone: string,
    main: boolean
  }> = [];

  comment: string = null;

  address: string = null; // unused

  discount: number = 0; // unused

  discountType = 'PERCENTAGE';

  email: string = null; // unused

  activeAccount = false;

  school: {
    grade: string; // unused
    name: string; // unused
  } = {
    grade: null,
    name: null,
  };

  sex: 'MALE' | 'FEMALE';

  statusId: string;
}

export interface ConversionResult {
  errors?: string[];
  student: CreateStudentRequest;
}

export enum Mapping {
  NAME,
  SEX,
  BIRTHDAY,
  COMMENT,
  PHONE_1,
  CONTACT_1,
  PHONE_2,
  CONTACT_2,
  PHONE_3,
  CONTACT_3,
  EMAIL,
  STATUS_ID,
  // unused by default
  SCHOOL,
  GRADE,
}

@Injectable()
export class ImportService {

  convert(data: Array<Array<string>>): ConversionResult[] {
    return data.map((studentData: Array<string>, idx: number) => idx === 0 ? null : this.convertStudent(studentData));
  }

  private convertStudent(data: Array<string>): ConversionResult {

    const result: ConversionResult = {
      student: new CreateStudentRequest(),
      errors: [],
    };

    this.convertName(result, data);
    this.convertSex(result, data);
    this.convertBirthday(result, data);
    this.convertSchool(result, data);
    this.convertGrade(result, data);
    this.convertEmail(result, data);
    this.convertComment(result, data);
    this.convertPhoneList(result, data);
    this.convertStatus(result, data);

    return result;
  }

  private convertName(result: ConversionResult, data: Array<string>): void {
    const name = (`${data[Mapping.NAME] || 'без имени'}` || '').trim();
    result.student.name = name;

    //todo temp
    result.student.name = result.student.name || 'Без имени';
    if (result.student.name.length < 3) {
      result.student.name = result.student.name.padEnd(3, '_');
    }

    if (!result.student.name || result.student.name.length < 3 || result.student.name.length > 50) {
      result.errors.push('name');
    }
  }

  private convertSchool(result: ConversionResult, data: Array<string>): void {
    if (!data[Mapping.SCHOOL]) {
      return;
    }

    const school = data[Mapping.SCHOOL];
    if (school.length > 100) {
      result.errors.push('school');
    }

    result.student.school.name = school;
  }

  private convertGrade(result: ConversionResult, data: Array<string>): void {
    if (!data[Mapping.GRADE]) {
      return;
    }

    const grade = data[Mapping.GRADE];
    if (grade.length > 100) {
      result.errors.push('grade');
    }

    result.student.school.grade = grade;
  }

  private convertStatus(result: ConversionResult, data: Array<string>): void {
    if (!data[Mapping.STATUS_ID]) {
      return;
    }

    const statusId = data[Mapping.STATUS_ID];
    if (statusId.length > 100) {
      result.errors.push('statusId');
    }

    result.student.statusId = statusId;
  }

  private convertSex(result: ConversionResult, data: Array<string>): void {
    let sex = (`${data[Mapping.SEX]}` || '').trim().toLowerCase().charAt(0);

    if (!sex) {
      result.errors.push('sex');
      return;
    }

    if (['м', 'ж'].indexOf(sex) === -1) {
      result.student.sex = 'MALE';
      // result.errors.push('sex');
    } else {
      result.student.sex = (sex === 'ж' ? 'FEMALE' : 'MALE');
    }
  }

  private convertEmail(result: ConversionResult, data: Array<string>): void {

    if (!data[Mapping.EMAIL]) {
      return;
    }

    const email = data[Mapping.EMAIL];
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      result.errors.push('email');
    } else {
      result.student.email = email;
    }
  }

  private convertBirthday(result: ConversionResult, data: Array<string>): void {

    if (!data[Mapping.BIRTHDAY]) {
      return;
    }

    const dateDto = this.parseDate(data[Mapping.BIRTHDAY]);
    if (!dateDto) {
      result.errors.push(`unparsableDate: ${data[Mapping.BIRTHDAY]}`);
    } else if (!dateDto.day || !dateDto.month || !dateDto.year) {
      result.errors.push('birthday: ' + JSON.stringify(dateDto) + ', ' + data[Mapping.BIRTHDAY]);
    } else {
      result.student.birthday = dateDto;
    }
  }

  private parseDate(date: string): { day: number; month: number; year: number; } {

    if (typeof date === 'number') {
      const jsDate = new Date((date - (25567 + 2)) * 86400 * 1000);
      return { day: jsDate.getDate(), month: jsDate.getMonth() + 1, year: jsDate.getFullYear() };
    }

    let [day, month, year] = date.split('.').map(datePart => parseInt(datePart, 10));

    if (typeof year !== 'undefined' && year < 100) {
      year += 2000;
    }

    return { day, month, year };
  }

  private convertComment(result: ConversionResult, data: Array<string>): void {
    let comment = data[Mapping.COMMENT] ? `${data[Mapping.COMMENT]}`.trim() : null;

    result.student.comment = comment;
    if (comment && comment.length < 5) {
      result.student.comment = comment.padEnd(5, '.');
    }

    if (comment && comment.length > 500) {
      result.student.comment = result.student.comment.substr(0, 500);
      // result.errors.push('comment');
    }
  }

  private convertPhoneList(result: ConversionResult, data: Array<string>): void {
    const phone1 = {
      phone: data[Mapping.PHONE_1] ? `${data[Mapping.PHONE_1]}`.trim() : null,
      name: data[Mapping.CONTACT_1] ? `${data[Mapping.CONTACT_1]}`.trim() : null,
      main: false,
    };
    const phone2 = {
      phone: data[Mapping.PHONE_2] ? `${data[Mapping.PHONE_2]}`.trim() : null,
      name: data[Mapping.CONTACT_2] ? `${data[Mapping.CONTACT_2]}`.trim() : null,
      main: true,
    };
    const phone3 = {
      phone: data[Mapping.PHONE_3] ? `${data[Mapping.PHONE_3]}`.trim() : null,
      name: data[Mapping.CONTACT_3] ? `${data[Mapping.CONTACT_3]}`.trim() : null,
      main: false,
    };

    this.convertPhone(result, phone1, '1');
    this.convertPhone(result, phone2, '2');
    this.convertPhone(result, phone3, '3');

    const currentPhones = result.student.phoneList.map(phone => phone.phone);
    const uniquePhones = currentPhones.filter((phone, index, arr) => arr.indexOf(phone) === index);
    if (uniquePhones.length !== currentPhones.length) {
      result.errors.push('nonUniquePhones');
    }
  }

  private convertPhone(result: ConversionResult, data: { phone: string, name: string, main: boolean }, label: string): void {
    const phone = data.phone;
    const name = data.name;
    if (phone || name) {

      const p = {
        phone, name, main: '1' === label,
      };

      if (phone) {
        let validatedPhone = `${phone}`.replace(/[\-\W\(\)]/g, '');

        // validate mobile phone numbers
        if (validatedPhone.length > 7) {
          if (validatedPhone.startsWith('8')) {
            validatedPhone = `+7${validatedPhone.substr(1)}`;
          } else if (validatedPhone.startsWith('9')) {
            validatedPhone = `+7${validatedPhone}`;
          } else if (validatedPhone.startsWith('7')) {
            validatedPhone = `+${validatedPhone}`;
          }
        }

        p.phone = validatedPhone;

        if (p.phone.length < 5 || p.phone.length > 20) {
          result.errors.push(`phone_${label}`);
        }
      } else {
        p.phone = '00000';
      }

      // todo temp
      p.name = name ? name.trim().padEnd(3, '_') : name;

      if (p.name) {
        let validatedName = p.name.trim();
        if (validatedName.length < 3 || validatedName.length > 50) {
          result.errors.push(`contact_${label}: ${validatedName}`);
        }
      }

      result.student.phoneList.push(p);
    }
  }

}
