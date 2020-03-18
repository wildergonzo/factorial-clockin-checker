import { credentials, date, day, clockin } from '../../config/config.json';

describe('factorial clock in', () => {
    it('should fill clock in form', () => {
        //login
        browser.url('https://app.factorialhr.com/');
        $('#user_email').setValue(credentials.email);
        $('#user_password').setValue(credentials.password);
        $('.js-submit').click();

        browser.waitUntil( () => {
            return $('.logo___1ofKH').isDisplayed();
        });


        browser.url(`https://app.factorialhr.com/attendance/clock-in/${date.year}/${date.month}`);
        browser.waitUntil( () => { 
            return $('.tbody___2dGKu').isDisplayed();
        });

        let i = 0;
        let n = 0;
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

            if (day[n].getText() !== 'Sunday' && day[n].getText() !== 'Saturday' && leaves[n].getText() !== 'Holidays') {

                fields[i].setValue(clockin.morningStart);
                fields[i+1].addValue(clockin.morningEnd);

                //click submit
                $('.submit___IEW1l').click();

                if(closeSuccessTooltip() === false){
                    break;
                }

                //click (+)
                plusBtn[n].click();

                fields = $$('.normal___354i1.small___2lrXH.noLabel___wEbd9');

                fields[i+2].setValue(clockin.afternoonStart);
                fields[i+3].addValue(clockin.afternoonEnd);

                //click submit
                $('.submit___IEW1l').click();

                if(closeSuccessTooltip() === false){
                    break;
                }

                i += 4;

            } else {
                i += 2;
            }

            n += 1;
        }

    })
})

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