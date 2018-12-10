const filewriter = () => {
    let write = (url) =>{
    const info = new URLSearchParams(url);

    let res = {};

    res.name = info.get('name');
    res.appt = info.get('appt');
    res.time = info.get('time');
    res.returner = info.get('returner');
    res.address = info.getAll('address');
    res.phone = info.get('phone');
    res.social = info.get('social');
    res.dob = info.get('dob');
    res.gender = info.get('gender');
    res.race = info.get('race');
    res.marital = info.get('marital');
    res.ecname = info.get('ecname');
    res.ecphone = info.get('ecphone');
    res.reason = info.getAll('reason');
    res.alert = info.getAll('alert');
    res.chief = info.get('chief');
    res.hist = info.getAll('hist');
    res.primary = info.get('primary');
    res.member = info.get('member');
    res.group = info.get('group');
    res.policy = info.get('policy');
    res.idob = info.get('idob');

    console.log(res);
    }

    return {
        write: write
    }
};

export default filewriter;
