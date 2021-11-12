const Rx = artifacts.require("./Rx.sol");

contract("Rx", accounts => {

  // Define a value to test contract with
  const actors = {
    _owner: accounts[0],
    _badActor: accounts[1],
    _onlySubject: accounts[2],
    _doctor: accounts[3],
    _pharmacist: accounts[4],
    _onlySubject2: accounts[5],
  }

  const god = {
    _subjectId: actors._owner,
    _name: 'Allmighty',
    _birthDate: '0001-01-01',
    _homeAddress: 'The Universe',
  }
  const devil = {
    _subjectId: actors._badActor,
    _name: 'Belcebu',
    _birthDate: '0006-06-06',
    _homeAddress: 'Hell',
  }
  const alice = {
    _subjectId: actors._onlySubject,
    _name: 'Amy Adams',
    _birthDate: '2000-01-01',
    _homeAddress: '123 Alice St., Alice City',
  }
  const ben = {
    _subjectId: actors._doctor,
    _name: 'Benjamin Button ',
    _birthDate: '1999-02-02',
    _homeAddress: '123 Bob St., Bob City',
    _degree: 'Clinical',
    _license: '007',
  }
  const carl = {
    _subjectId: actors._pharmacist,
    _name: 'Carl Collins',
    _birthDate: '1990-03-03',
    _homeAddress: '123 Carl St., Carl City',
    _degree: 'Pharm Degree',
    _license: '420',
  }
  const david = {
    _subjectId: actors._onlySubject2,
    _name: 'David Donovan',
    _birthDate: '1980-01-01',
    _homeAddress: '123 David St., David City',
  }

  const rx1 = {
    keys: ['Medication', '', '', 'Dosage', 'Route', 'Frequency', 'Quantity', '', 'Refills', 'Diagnosis', '', 'Final key'],
    values: ['Tylenol', '', '', '1 (one) tablet', 'PO', 'Every 8 hours', '60 tablets', '', '0 Refills', 'Headache', '', 'Final Value'],
  }

  const rx2 = {
    keys: ['Medication', '', '', 'Dosage', 'Route', 'Frequency', 'Quantity', '', 'Refills', 'Diagnosis', '', 'Final key'],
    values: ['Ibuprofen 400mg', '', '', '1 (one) soft pill', 'PO', 'Every 12 hours', '15 pills', '', '0 Refills', 'Mild fever', '', 'Final Value'],
  }

  let rxInstance;
  let source;
  let stored;
  let patient;
  let minter;
  let burner;
  let rx;
  let finalUri1 = '';
  let finalUri2 = '';

  // Run this before each test
  beforeEach('setup contract for each test', async function () {
    rxInstance = await Rx.deployed();
    source = {};
    stored = {};
    patient = {};
    minter = {};
    burner = {};
    rx = {};
    uri = '';
  });


  it("...should NOT store a subject without admin role.", async () => {
    source = alice;
    // Try to create a Subject
    try{
      await rxInstance.setSubjectData(source._subjectId, source._name, source._birthDate, source._homeAddress, { from: actors._badActor });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was stored on the Subject.`);
    assert.notEqual(stored.name, source._name, `The value ${source._name} was stored on the Subject.`);
    assert.notEqual(stored.birthDate, source._birthDate, `The value ${source._birthDate} was stored on the Subject.`);
    assert.notEqual(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was stored on the Subject.`);
  });

  it("...should NOT store a doctor when the subject doesn't exist.", async () => {
    source = ben;
    // Try to create a Doctor
    try{
      await rxInstance.setDoctorData(source._subjectId, source._degree, source._license, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getDoctor.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was stored on the Subject.`);
    assert.notEqual(stored.degree, source._degree, `The value ${source._degree} was stored on the Subject.`);
    assert.notEqual(stored.license, source._license, `The value ${source._license} was stored on the Subject.`);

  });

  it("...should NOT store a pharmacist when the subject doesn't exist.", async () => {
    source = carl;
    // Try to create a Doctor
    try{
      await rxInstance.setPharmacistData(source._subjectId, source._degree, source._license, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getPharmacist.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was stored on the Subject.`);
    assert.notEqual(stored.degree, source._degree, `The value ${source._degree} was stored on the Subject.`);
    assert.notEqual(stored.license, source._license, `The value ${source._license} was stored on the Subject.`);

  });

  it("...should store a subject.", async () => {
    source = alice;
    // Create a Subject
    await rxInstance.setSubjectData(source._subjectId, source._name, source._birthDate, source._homeAddress, { from: actors._owner });

    // Get stored Subject
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not stored on the Subject.`);
    assert.equal(stored.name, source._name, `The value ${source._name} was not stored on the Subject.`);
    assert.equal(stored.birthDate, source._birthDate, `The value ${source._birthDate} was not stored on the Subject.`);
    assert.equal(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was not stored on the Subject.`);
  });

  it("...should store another subject.", async () => {
    source = ben;
    // Create a Subject
    await rxInstance.setSubjectData(source._subjectId, source._name, source._birthDate, source._homeAddress, { from: actors._owner });

    // Get stored Subject
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not stored on the Subject.`);
    assert.equal(stored.name, source._name, `The value ${source._name} was not stored on the Subject.`);
    assert.equal(stored.birthDate, source._birthDate, `The value ${source._birthDate} was not stored on the Subject.`);
    assert.equal(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was not stored on the Subject.`);
  });

  it("...should store yet another subject.", async () => {
    source = carl;
    // Create a Subject
    await rxInstance.setSubjectData(source._subjectId, source._name, source._birthDate, source._homeAddress, { from: actors._owner });

    // Get stored Subject
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not stored on the Subject.`);
    assert.equal(stored.name, source._name, `The value ${source._name} was not stored on the Subject.`);
    assert.equal(stored.birthDate, source._birthDate, `The value ${source._birthDate} was not stored on the Subject.`);
    assert.equal(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was not stored on the Subject.`);
  });

  it("...should NOT store a doctor without admin role.", async () => {
    source = ben;
    // Try to create a Doctor
    try{
      await rxInstance.setDoctorData(source._subjectId, source._degree, source._license, { from: actors._badActor });
    } catch (err) { } //console.log(err); }

    // Try to get stored value
    stored = await rxInstance.getDoctor.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was stored on the Subject.`);
    assert.notEqual(stored.degree, source._degree, `The value ${source._degree} was stored on the Subject.`);
    assert.notEqual(stored.license, source._license, `The value ${source._license} was stored on the Subject.`);

  });

  it("...should store a doctor.", async () => {
    source = ben;
    // Try to create a Doctor
    try{
      await rxInstance.setDoctorData(source._subjectId, source._degree, source._license, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Try to get stored value
    stored = await rxInstance.getDoctor.call(source._subjectId);

    // Check Doctor Data
    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not stored on the Subject.`);
    assert.equal(stored.degree, source._degree, `The value ${source._degree} was not stored on the Subject.`);
    assert.equal(stored.license, source._license, `The value ${source._license} was not stored on the Subject.`);

  });


  it("...should NOT store a pharmacist without admin role.", async () => {
    source = carl;
    // Try to create a Doctor
    try{
      await rxInstance.setPharmacistData(source._subjectId, source._degree, source._license, { from: actors._badActor });
    } catch (err) { } //console.log(err); }

    // Try to get stored value
    stored = await rxInstance.getPharmacist.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was stored on the Subject.`);
    assert.notEqual(stored.degree, source._degree, `The value ${source._degree} was stored on the Subject.`);
    assert.notEqual(stored.license, source._license, `The value ${source._license} was stored on the Subject.`);

  });

  it("...should store a pharmacist.", async () => {
    source = carl;
    // Try to create a Pharmacist
    try{
      await rxInstance.setPharmacistData(source._subjectId, source._degree, source._license, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Try to get stored value
    stored = await rxInstance.getPharmacist.call(source._subjectId);

    // Check Doctor Data
    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not stored on the Subject.`);
    assert.equal(stored.degree, source._degree, `The value ${source._degree} was not stored on the Subject.`);
    assert.equal(stored.license, source._license, `The value ${source._license} was not stored on the Subject.`);

  });

  it("...should store yet yet another subject.", async () => {
    source = david;
    // Create a Subject
    await rxInstance.setSubjectData(source._subjectId, source._name, source._birthDate, source._homeAddress, { from: actors._owner });

    // Get stored Subject
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not stored on the Subject.`);
    assert.equal(stored.name, source._name, `The value ${source._name} was not stored on the Subject.`);
    assert.equal(stored.birthDate, source._birthDate, `The value ${source._birthDate} was not stored on the Subject.`);
    assert.equal(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was not stored on the Subject.`);
  });

  it("...should NOT mint prescription (not a doctor)", async () => {
    minter = alice;
    patient = ben;
    rx = rx1;

    // Try to generate prescription token URI
    try {
      await rxInstance.mintPrescription(patient._subjectId, rx.keys, rx.values, { from: minter._subjectId });
      uri = await rxInstance.tokenURI(1);
    } catch (err) { } //console.log(err); }


    assert.equal(uri, '', `The tokenURI should have not been generated, but was stored as: \n${uri}\n`);
  });

  it("...should NOT mint prescription (doctor, but cannot prescribe to self)", async () => {
    minter = ben;
    patient = ben;
    rx = rx1;

    // Try to generate prescription token URI
    try {
      await rxInstance.mintPrescription(patient._subjectId, rx.keys, rx.values, { from: minter._subjectId });
      uri = await rxInstance.tokenURI(1);
    } catch (err) { } //console.log(err); }

    assert.equal(uri, '', `The tokenURI should have not been generated, but was stored as: \n${uri}\n`);
  });

  it("...should NOT mint prescription ('patient' is not a subject)", async () => {
    minter = ben;
    patient = god;
    rx = rx1;

    // Try to generate prescription token URI
    try {
      await rxInstance.mintPrescription(patient._subjectId, rx.keys, rx.values, { from: minter._subjectId });
      uri = await rxInstance.tokenURI(1);
    } catch (err) { } //console.log(err); }

    assert.equal(uri, '', `The tokenURI should have not been generated, but was stored as: \n${uri}\n`);
  });

  it("...should mint prescription (doctor, minting to patient)", async () => {
    minter = ben;
    patient = alice;
    rx = rx1;

    // Try to generate prescription token URI
    try {
      tokenURI = await rxInstance.mintPrescription(patient._subjectId, rx.keys, rx.values, { from: minter._subjectId });
      uri = await rxInstance.tokenURI(1);
    } catch (err) { } //console.log(err); }

    assert.notEqual(uri, '', `The tokenURI should have been generated, but was stored as: \n"${uri}"\n`);

    finalUri1 = uri;
    
  });
  
  it("...should mint prescription (doctor, minting to another patient)", async () => {
    minter = ben;
    patient = david;
    rx = rx2;
    
    // Try to generate prescription token URI
    try {
      await rxInstance.mintPrescription(patient._subjectId, rx.keys, rx.values, { from: minter._subjectId });
      uri = await rxInstance.tokenURI(2);
    } catch (err) { } //console.log(err); }
    
    assert.notEqual(uri, '', `The tokenURI should have been generated, but was stored as: \n"${uri}"\n`);
    
    finalUri2 = uri;
    
    console.log(`Generated tokenURI 1:\n${finalUri1}\n`);
    console.log(`Generated tokenURI 2:\n${finalUri2}\n`);
  
  });
  
  it("...should NOT remove a subject without admin role.", async () => {
    source = alice;
    // Try to remove a Subject
    try{
      await rxInstance.removeSubject(source._subjectId, { from: actors._badActor });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was removed.`);
    assert.equal(stored.name, source._name, `The value ${source._name} was removed.`);
    assert.equal(stored.birthDate, source._birthDate, `The value ${source._birthDate} was removed.`);
    assert.equal(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was removed.`);
  });

  it("...should NOT remove a doctor without admin role.", async () => {
    source = ben;
    // Try to remove a Doctor
    try{
      await rxInstance.removeDoctor(source._subjectId, { from: actors._badActor });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getDoctor.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was removed.`);
    assert.equal(stored.degree, source._degree, `The value ${source._degree} was removed.`);
    assert.equal(stored.license, source._license, `The value ${source._license} was removed.`);
  });

  it("...should NOT remove a pharmacist without admin role.", async () => {
    source = carl;
    // Try to remove a Doctor
    try{
      await rxInstance.removePharmacist(source._subjectId, { from: actors._badActor });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getPharmacist.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was removed.`);
    assert.equal(stored.degree, source._degree, `The value ${source._degree} was removed.`);
    assert.equal(stored.license, source._license, `The value ${source._license} was removed.`);
  });

  it("...should NOT remove a subject when the doctor exists.", async () => {
    source = ben;
    // Try to remove a Subject
    try{
      await rxInstance.removeSubject(source._subjectId, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was removed.`);
    assert.equal(stored.name, source._name, `The value ${source._name} was removed.`);
    assert.equal(stored.birthDate, source._birthDate, `The value ${source._birthDate} was removed.`);
    assert.equal(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was removed.`);

  });

  it("...should NOT remove a subject when the pharmacist exists.", async () => {
    source = carl;
    // Try to remove a Subject
    try{
      await rxInstance.removeSubject(source._subjectId, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.equal(stored.subjectId, source._subjectId, `The address ${source._subjectId} was removed.`);
    assert.equal(stored.name, source._name, `The value ${source._name} was removed.`);
    assert.equal(stored.birthDate, source._birthDate, `The value ${source._birthDate} was removed.`);
    assert.equal(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was removed.`);

  });

  it("...should remove a doctor.", async () => {
    source = ben;
    // Try to remove a Doctor
    try{
      await rxInstance.removeDoctor(source._subjectId, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getDoctor.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not removed.`);
    assert.notEqual(stored.degree, source._degree, `The value ${source._degree} was not removed.`);
    assert.notEqual(stored.license, source._license, `The value ${source._license} was not removed.`);

  });

  it("...should remove a pharmacist.", async () => {
    source = carl;
    // Try to create a Doctor
    try{
      await rxInstance.removePharmacist(source._subjectId, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getPharmacist.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not removed.`);
    assert.notEqual(stored.degree, source._degree, `The value ${source._degree} was not removed.`);
    assert.notEqual(stored.license, source._license, `The value ${source._license} was not removed.`);

  });

  it("...should remove a subject now that pharmacist doesn't exist.", async () => {
    source = carl;
    // Try to remove a Subject
    try{
      await rxInstance.removeSubject(source._subjectId, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not removed.`);
    assert.notEqual(stored.name, source._name, `The value ${source._name} was not removed.`);
    assert.notEqual(stored.birthDate, source._birthDate, `The value ${source._birthDate} was not removed.`);
    assert.notEqual(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was not removed.`);

  });

  it("...should remove a subject now that doctor doesn't exist.", async () => {
    source = ben;
    // Try to remove a Subject
    try{
      await rxInstance.removeSubject(source._subjectId, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not removed.`);
    assert.notEqual(stored.name, source._name, `The value ${source._name} was not removed.`);
    assert.notEqual(stored.birthDate, source._birthDate, `The value ${source._birthDate} was not removed.`);
    assert.notEqual(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was not removed.`);

  });

  it("...should remove a subject.", async () => {
    source = david;
    // Try to remove a Subject
    try{
      await rxInstance.removeSubject(source._subjectId, { from: actors._owner });
    } catch (err) { } //console.log(err); }

    // Get stored value
    stored = await rxInstance.getSubject.call(source._subjectId);

    assert.notEqual(stored.subjectId, source._subjectId, `The address ${source._subjectId} was not removed.`);
    assert.notEqual(stored.name, source._name, `The value ${source._name} was not removed.`);
    assert.notEqual(stored.birthDate, source._birthDate, `The value ${source._birthDate} was not removed.`);
    assert.notEqual(stored.homeAddress, source._homeAddress, `The value ${source._homeAddress} was not removed.`);

  });

});
