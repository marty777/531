// 5/3/1 js
function numReps(week, set) {
	var reps = [
		[5,5,5,5,"5+"],
		[5,5,3,3,"3+"],
		[5,5,5,3,"1+"],
		[5,5,5,5,5]
	];
	week = parseInt(week);
	if(week < 0 || week > 3 || !Number.isInteger(week)) {
		return 0;
	}
	if(set < 0 || set > 4 || !Number.isInteger(set)) {
		return 0;
	}
	return reps[week][set];
}

function calculateSetWeight(week, set, max, roundTo5) {
	var coefficient = [
		[0.4, 0.5, 0.65, 0.75, 0.85],
		[0.4, 0.5, 0.7, 0.8, 0.9],
		[0.4, 0.5, 0.75, 0.85, 0.95],
		[0.2, 0.3, 0.4, 0.5, 0.6]
	];
	week = parseInt(week);
	if(week < 0 || week > 3 || !Number.isInteger(week)) {
		return 0;
	}
	if(set < 0 || set > 4 || !Number.isInteger(set)) {
		return 0;
	}
	if(!$.isNumeric(max)) {
		return 0;
	}
	var result = Math.ceil(coefficient[week][set] * max);
	if(roundTo5) {
		result = Math.ceil(result*0.2)*5.0;
	}
	return result;
}	

function calcSets(id) {
	var max = $('#'+id).val();
	var week = $('#cycleSelect').val();
	var roundupto5 = false;
	week = week -1;
	if(!$.isNumeric(max)) {
		$('#'+id).parent().parent().addClass('has-error has-feedback');
		max = 0;
	}
	else {
		$('#'+id).parent().parent().removeClass('has-error has-feedback');
	}
	if($('#use90checkbox').is(':checked')) {
		max = 0.9 * max;
	}
	if($('#roundupto5checkbox').is(':checked')) {
		roundupto5 = true;
	}
	$('#'+id).parent().parent().parent().find('table').show();
	var tablebody = $('#'+id).parent().parent().parent().find('tbody').first();
	tablebody.empty();
	//alert(numReps(week, 1).toString() + ' ' + week.toString());
	tablebody.append('<tr ><th>Warmup</th><td>'+numReps(week, 0).toString()+'</td><td>'+calculateSetWeight(week, 0, max, roundupto5).toString()+'</td></tr>');
	tablebody.append('<tr ><th>Warmup</th><td>'+numReps(week, 1).toString()+'</td><td>'+calculateSetWeight(week, 1, max, roundupto5).toString()+'</td></tr>');
	tablebody.append('<tr class="success"><th>Set 1</th><td>'+numReps(week, 2).toString()+'</td><td>'+calculateSetWeight(week, 2, max, roundupto5).toString()+'</td></tr>');
	tablebody.append('<tr class="success"><th>Set 2</th><td>'+numReps(week, 3).toString()+'</td><td>'+calculateSetWeight(week, 3, max, roundupto5).toString()+'</td></tr>');
	tablebody.append('<tr class="success"><th>Set 3</th><td>'+numReps(week, 4).toString()+'</td><td>'+calculateSetWeight(week, 4, max, roundupto5).toString()+'</td></tr>');
}

function oneRepMaxCalc() {
	// test inputs
	var reps = $('#calcReps').val();
	var weight = $('#calcWeight').val();
	if(!$.isNumeric(reps)) {
		$('#calcReps').parent().parent().addClass('has-error has-feedback');
	}
	else {
		$('#calcReps').parent().parent().removeClass('has-error has-feedback');
	}
	if(!$.isNumeric(weight)) {
		
		$('#calcWeight').parent().parent().addClass('has-error has-feedback');
	}
	else {
		$('#calcWeight').parent().parent().removeClass('has-error has-feedback');
	}
	if($.isNumeric(reps) && $.isNumeric(weight)) {
		var result = (Number(reps) * 0.0333 * Number(weight)) + Number(weight);
		$('#calcResult').val(Math.round(result));
	}
}

function saveSetting(key, value) {
	if(typeof(Storage) !== 'undefined') {
		localStorage.setItem(key, value);
	}
	else {
		Cookies.set(key, value, {expires: 365});
	}
}

function loadSetting(key) {
	if(typeof(Storage) !== 'undefined') {
		return localStorage.getItem(key);
	}
	else {
		return Cookies.get(key);
	}
}

function saveSettings() {
	var week = $('#cycleSelect').val();
	var use90percent = $('#use90checkbox').is(':checked');
	var roundupto5 = $('#roundupto5checkbox').is(':checked');
	var currOHPMax = $('#ohpMax').val();
	var currDLMax = $('#dlMax').val();
	var currBenchMax = $('#benchMax').val();
	var currSquatMax = $('#squatMax').val();
	
	saveSetting('currWeek', week);
	saveSetting('use90percent', use90percent);
	saveSetting('roundupto5', roundupto5);
	saveSetting('currOHPMax', currOHPMax);
	saveSetting('currDLMax', currDLMax);
	saveSetting('currBenchMax', currBenchMax);
	saveSetting('currSquatMax', currSquatMax);
	
}

function loadSettings() {
	var week = loadSetting('currWeek');
	var use90percent = loadSetting('use90percent');
	var roundupto5 = loadSetting('roundupto5');
	var currOHPMax = loadSetting('currOHPMax');
	var currDLMax = loadSetting('currDLMax');
	var currBenchMax = loadSetting('currBenchMax');
	var currSquatMax = loadSetting('currSquatMax');
	if(typeof week != 'undefined') {
		$('#cycleSelect').val(week);
	}
	if(use90percent == 'true') {
		$('#use90checkbox').prop('checked', true);
	}
	if(roundupto5 == 'true') {
		$('#roundupto5checkbox').prop('checked', true);
	}
	if(typeof currOHPMax != 'undefined') {
		$('#ohpMax').val(currOHPMax);
	}
	if(typeof currDLMax != 'undefined') {
		$('#dlMax').val(currDLMax);
	}
	if(typeof currBenchMax != 'undefined') {
		$('#benchMax').val(currBenchMax);
	}
	if(typeof currSquatMax != 'undefined') {
		$('#squatMax').val(currSquatMax);
	}
}

function calculateAll() {
	calcSets('ohpMax');
	calcSets('dlMax');
	calcSets('benchMax');
	calcSets('squatMax');
	saveSettings();
}

function copyAndCalculateAll() {
	
}

$(document).ready(function() {
	
	$('#calc1RepMax').click(oneRepMaxCalc);
	$('#copyAndCalculateAll').click(copyAndCalculateAll);
	$('#cycleSelect').change(calculateAll);
	$('#use90checkbox').change(calculateAll);
	$('#roundupto5checkbox').change(calculateAll);
	$('#ohpMax').change(calculateAll);
	$('#dlMax').change(calculateAll);
	$('#benchMax').change(calculateAll);
	$('#squatMax').change(calculateAll);
	loadSettings();
	calculateAll();
	
	Sortable.create(currMaxs, { /* options */ });
});