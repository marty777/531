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

function saveSettings() {
	var week = $('#cycleSelect').val();
	var use90percent = $('#use90checkbox').is(':checked');
	var roundupto5 = $('#roundupto5checkbox').is(':checked');
	var currOHPMax = $('#pressCurrMax').val();
	var currDLMax = $('#dlCurrMax').val();
	var currBenchMax = $('#benchCurrMax').val();
	var currSquatMax = $('#squatCurrMax').val();
	Cookies.set('currWeek', week, {expires: 365});
	Cookies.set('use90percent', use90percent, {expires: 365});
	Cookies.set('currOHPMax', currOHPMax, {expires: 365});
	Cookies.set('currDLMax', currDLMax, {expires: 365});
	Cookies.set('currBenchMax', currBenchMax, {expires: 365});
	Cookies.set('currSquatMax', currSquatMax, {expires: 365});
}

function loadSettings() {
	var week = Cookies.get('currWeek');
	var use90percent = Cookies.get('use90percent');
	var roundupto5 = Cookies.get('roundupto5');
	var currOHPMax = Cookies.get('currOHPMax');
	var currDLMax = Cookies.get('currDLMax');
	var currBenchMax = Cookies.get('currBenchMax');
	var currSquatMax = Cookies.get('currSquatMax');
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
		$('#pressCurrMax').val(currOHPMax);
	}
	if(typeof currDLMax != 'undefined') {
		$('#dlCurrMax').val(currDLMax);
	}
	if(typeof currBenchMax != 'undefined') {
		$('#benchCurrMax').val(currBenchMax);
	}
	if(typeof currSquatMax != 'undefined') {
		$('#squatCurrMax').val(currSquatMax);
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
	$('#ohpMax').val($('#pressCurrMax').val());
	$('#dlMax').val($('#dlCurrMax').val());
	$('#benchMax').val($('#benchCurrMax').val());
	$('#squatMax').val($('#squatCurrMax').val());
	calculateAll();
}

$(document).ready(function() {
	
	$('#calc1RepMax').click(oneRepMaxCalc);
	$('#testButton').click(function() {
		calcSets('ohpMax');
	})
	$('#saveSettings').click(saveSettings);
	$('#copyAndCalculateAll').click(copyAndCalculateAll);
	$('#cycleSelect').change(calculateAll);
	$('#use90checkbox').change(calculateAll);
	$('#roundupto5checkbox').change(calculateAll);
	$('#ohpMax').change(calculateAll);
	$('#dlMax').change(calculateAll);
	$('#benchMax').change(calculateAll);
	$('#squatMax').change(calculateAll);
	loadSettings();
});