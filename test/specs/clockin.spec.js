import { credentials, date, day, clockin } from '../../config/config.json';

describe('factorial clock in', () => {
    it('should fill clock in form', () => {

        browser.url('https://app.factorialhr.com/');
        login(credentials.email, credentials.password);

        openClockInPage(date.year, date.month);

        let i = 0; // shift index
        let n = 0; // row index
        let max = $$('.normal___354i1.small___2lrXH.noLabel___wEbd9').length * 2;
        let plusBtn = $$('.default___2GP40.terciary___20b_P');
        let day = $$('.weekDay___26AC_');
        let leaves = $$('.column___JEI98');


        while(i < max) {

            let fields = $$('.normal___354i1.small___2lrXH.noLabel___wEbd9');

            fields[i].scrollIntoView();
            if (!fields[i].isEnabled()) {
                break;
            }

            if (!isWeekend(day[n]) && !isHoliday(leaves[n])) {
                // set worked shifts
                if(isFriday(day[n]) && clockin.intensive) {
                    setWorkedShifts(fields, i, clockin.morningStart, clockin.fridayEnd);
                } else {

                    setWorkedShifts(fields, i, clockin.morningStart, clockin.morningEnd);

                    //click submit
                    $('.submit___IEW1l').click();

                    if(closeSuccessTooltip() === false){
                        break;
                    }

                    //click (+): add shifts
                    plusBtn[n].click();

                    fields = $$('.normal___354i1.small___2lrXH.noLabel___wEbd9');

                    // set worked shifts
                    if(isFriday(day[n])) {
                        setWorkedShifts(fields, i+2, clockin.afternoonStart, clockin.fridayEnd);
                    } else {
                        setWorkedShifts(fields, i+2, clockin.afternoonStart, clockin.afternoonEnd);
                    }

                    //click submit
                    $('.submit___IEW1l').click();

                    if(closeSuccessTooltip() === false){
                        break;
                    }
                }

                i += 4;

            } else {
                i += 2;
            }

            n += 1;
        }

    })
})

const login = (email, password) => {
    $('#user_email').setValue(email);
    $('#user_password').setValue(password);
    $('.js-submit').click();

    browser.waitUntil( () => {
        return $('.logo___1ofKH').isDisplayed();
    });
}

const openClockInPage = (year, month) => {
    browser.url(`https://app.factorialhr.com/attendance/clock-in/${year}/${month}`);
    browser.waitUntil( () => {
        return $('.tbody___2dGKu').isDisplayed();
    });
}

const setWorkedShifts = (elements, index, start, end) => {
    elements[index].setValue(start);
    elements[index+1].addValue(end);
}

const closeSuccessTooltip = () => {
    try {
        browser.waitUntil( () => {
            return $('.base___3_J1c.utility.black___13dD7.smaller___85pB1').isDisplayed();
        }, 3000);
        $('.base___3_J1c.utility.black___13dD7.smaller___85pB1').click();
    } catch {
        return false;
    }
}

const isWeekend = (element) => {
    if(element.getText() === 'Saturday' || element.getText() === 'Sunday') {
        return true;
    }

    return false;
}

const isHoliday = (element) => {
    if(element.getText() === 'Holidays') {
        return true;
    }

    return false;
}

const isFriday = (element) => {
    if(element.getText() === 'Friday') {
        return true;
    }

    return false;
}