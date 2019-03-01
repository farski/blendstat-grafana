System.register(["jquery.flot", "./lib/flot/jquery.flot.gauge", "jquery.flot.time", "jquery.flot.crosshair", "lodash", "jquery", "app/core/utils/kbn", "app/core/config", "app/core/time_series2", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var lodash_1, jquery_1, kbn_1, config_1, time_series2_1, sdk_1, BlendStatCtrl;
    var __moduleName = context_1 && context_1.id;
    function getColorForValue(data, value) {
        if (!lodash_1.default.isFinite(value)) {
            return null;
        }
        for (var i = data.thresholds.length; i > 0; i--) {
            if (value >= data.thresholds[i - 1]) {
                return data.colorMap[i];
            }
        }
        return lodash_1.default.first(data.colorMap);
    }
    exports_1("getColorForValue", getColorForValue);
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {
            BlendStatCtrl = (function (_super) {
                __extends(BlendStatCtrl, _super);
                function BlendStatCtrl($scope, $injector, $sanitize, $location) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$sanitize = $sanitize;
                    _this.$location = $location;
                    _this.dataType = 'timeseries';
                    _this.valueNameOptions = [
                        { value: 'min', text: 'Min' },
                        { value: 'max', text: 'Max' },
                        { value: 'avg', text: 'Average' },
                        { value: 'current', text: 'Current' },
                        { value: 'total', text: 'Total' },
                        { value: 'name', text: 'Name' },
                        { value: 'first', text: 'First' },
                        { value: 'delta', text: 'Delta' },
                        { value: 'diff', text: 'Difference' },
                        { value: 'range', text: 'Range' },
                        { value: 'last_time', text: 'Time of last point' },
                    ];
                    _this.blendNameOptions = [
                        { value: 'min', text: 'Min' },
                        { value: 'max', text: 'Max' },
                        { value: 'avg', text: 'Average' },
                        { value: 'total', text: 'Total' },
                    ];
                    _this.panelDefaults = {
                        links: [],
                        datasource: null,
                        maxDataPoints: 100,
                        interval: null,
                        targets: [{}],
                        cacheTimeout: null,
                        format: 'none',
                        prefix: '',
                        postfix: '',
                        nullText: null,
                        valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
                        mappingTypes: [{ name: 'value to text', value: 1 }, { name: 'range to text', value: 2 }],
                        rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
                        mappingType: 1,
                        nullPointMode: 'connected',
                        valueName: 'avg',
                        blendName: 'total',
                        prefixFontSize: '50%',
                        valueFontSize: '80%',
                        postfixFontSize: '50%',
                        thresholds: '',
                        colorBackground: false,
                        colorValue: false,
                        colors: ['#299c46', 'rgba(237, 129, 40, 0.89)', '#d44a3a'],
                        sparkline: {
                            show: false,
                            full: false,
                            lineColor: 'rgb(31, 120, 193)',
                            fillColor: 'rgba(31, 118, 189, 0.18)',
                        },
                        gauge: {
                            show: false,
                            minValue: 0,
                            maxValue: 100,
                            thresholdMarkers: true,
                            thresholdLabels: false,
                        },
                        tableColumn: '',
                    };
                    lodash_1.default.defaults(_this.panel, _this.panelDefaults);
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.onSparklineColorChange = _this.onSparklineColorChange.bind(_this);
                    _this.onSparklineFillChange = _this.onSparklineFillChange.bind(_this);
                    return _this;
                }
                BlendStatCtrl.prototype.onInitEditMode = function () {
                    this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
                    this.addEditorTab('Options', 'public/plugins/farski-blendstat-panel/editor.html', 2);
                    this.addEditorTab('Value Mappings', 'public/plugins/farski-blendstat-panel/mappings.html', 3);
                    this.addEditorTab('Blending', 'public/plugins/farski-blendstat-panel/blending.html', 4);
                    this.unitFormats = kbn_1.default.getUnitFormats();
                };
                BlendStatCtrl.prototype.setUnitFormat = function (subItem) {
                    this.panel.format = subItem.value;
                    this.refresh();
                };
                BlendStatCtrl.prototype.onDataError = function (err) {
                    this.onDataReceived([]);
                };
                BlendStatCtrl.prototype.onDataReceived = function (dataList) {
                    if (dataList.length > 1) {
                        var timestamps_1 = {};
                        var counts = {};
                        for (var _i = 0, dataList_1 = dataList; _i < dataList_1.length; _i++) {
                            var series = dataList_1[_i];
                            for (var _a = 0, _b = series.datapoints; _a < _b.length; _a++) {
                                var point = _b[_a];
                                if (timestamps_1[point[1]]) {
                                    switch (this.panel.blendName) {
                                        case 'min':
                                            if (point[0] < timestamps_1[point[1]]) {
                                                timestamps_1[point[1]] = point[0];
                                            }
                                            break;
                                        case 'max':
                                            if (point[0] > timestamps_1[point[1]]) {
                                                timestamps_1[point[1]] = point[0];
                                            }
                                            break;
                                        case 'avg':
                                            timestamps_1[point[1]] = (timestamps_1[point[1]] * counts[point[1]] + point[0]) / (counts[point[1]] + 1);
                                            counts[point[1]] += 1;
                                            break;
                                        default:
                                            timestamps_1[point[1]] += point[0];
                                            break;
                                    }
                                }
                                else {
                                    timestamps_1[point[1]] = point[0];
                                    counts[point[1]] = 1;
                                }
                            }
                        }
                        var datapoints = Object.keys(timestamps_1).sort().map(function (ts) {
                            return [timestamps_1[ts], ts];
                        });
                        dataList = [{ target: 'Blended_Metrics', datapoints: datapoints }];
                    }
                    var data = {
                        scopedVars: lodash_1.default.extend({}, this.panel.scopedVars),
                    };
                    if (dataList.length > 0 && dataList[0].type === 'table') {
                        this.dataType = 'table';
                        var tableData = dataList.map(this.tableHandler.bind(this));
                        this.setTableValues(tableData, data);
                    }
                    else {
                        this.dataType = 'timeseries';
                        this.series = dataList.map(this.seriesHandler.bind(this));
                        this.setValues(data);
                    }
                    this.data = data;
                    this.render();
                };
                BlendStatCtrl.prototype.seriesHandler = function (seriesData) {
                    var series = new time_series2_1.default({
                        datapoints: seriesData.datapoints || [],
                        alias: seriesData.target,
                    });
                    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
                    return series;
                };
                BlendStatCtrl.prototype.tableHandler = function (tableData) {
                    var datapoints = [];
                    var columnNames = {};
                    tableData.columns.forEach(function (column, columnIndex) {
                        columnNames[columnIndex] = column.text;
                    });
                    this.tableColumnOptions = columnNames;
                    if (!lodash_1.default.find(tableData.columns, ['text', this.panel.tableColumn])) {
                        this.setTableColumnToSensibleDefault(tableData);
                    }
                    tableData.rows.forEach(function (row) {
                        var datapoint = {};
                        row.forEach(function (value, columnIndex) {
                            var key = columnNames[columnIndex];
                            datapoint[key] = value;
                        });
                        datapoints.push(datapoint);
                    });
                    return datapoints;
                };
                BlendStatCtrl.prototype.setTableColumnToSensibleDefault = function (tableData) {
                    if (tableData.columns.length === 1) {
                        this.panel.tableColumn = tableData.columns[0].text;
                    }
                    else {
                        this.panel.tableColumn = lodash_1.default.find(tableData.columns, function (col) {
                            return col.type !== 'time';
                        }).text;
                    }
                };
                BlendStatCtrl.prototype.setTableValues = function (tableData, data) {
                    if (!tableData || tableData.length === 0) {
                        return;
                    }
                    if (tableData[0].length === 0 || tableData[0][0][this.panel.tableColumn] === undefined) {
                        return;
                    }
                    var datapoint = tableData[0][0];
                    data.value = datapoint[this.panel.tableColumn];
                    if (lodash_1.default.isString(data.value)) {
                        data.valueFormatted = lodash_1.default.escape(data.value);
                        data.value = 0;
                        data.valueRounded = 0;
                    }
                    else {
                        var decimalInfo = this.getDecimalsForValue(data.value);
                        var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                        data.valueFormatted = formatFunc(datapoint[this.panel.tableColumn], decimalInfo.decimals, decimalInfo.scaledDecimals);
                        data.valueRounded = kbn_1.default.roundValue(data.value, this.panel.decimals || 0);
                    }
                    this.setValueMapping(data);
                };
                BlendStatCtrl.prototype.canModifyText = function () {
                    return !this.panel.gauge.show;
                };
                BlendStatCtrl.prototype.setColoring = function (options) {
                    if (options.background) {
                        this.panel.colorValue = false;
                        this.panel.colors = ['rgba(71, 212, 59, 0.4)', 'rgba(245, 150, 40, 0.73)', 'rgba(225, 40, 40, 0.59)'];
                    }
                    else {
                        this.panel.colorBackground = false;
                        this.panel.colors = ['rgba(50, 172, 45, 0.97)', 'rgba(237, 129, 40, 0.89)', 'rgba(245, 54, 54, 0.9)'];
                    }
                    this.render();
                };
                BlendStatCtrl.prototype.invertColorOrder = function () {
                    var tmp = this.panel.colors[0];
                    this.panel.colors[0] = this.panel.colors[2];
                    this.panel.colors[2] = tmp;
                    this.render();
                };
                BlendStatCtrl.prototype.onColorChange = function (panelColorIndex) {
                    var _this = this;
                    return function (color) {
                        _this.panel.colors[panelColorIndex] = color;
                        _this.render();
                    };
                };
                BlendStatCtrl.prototype.onSparklineColorChange = function (newColor) {
                    this.panel.sparkline.lineColor = newColor;
                    this.render();
                };
                BlendStatCtrl.prototype.onSparklineFillChange = function (newColor) {
                    this.panel.sparkline.fillColor = newColor;
                    this.render();
                };
                BlendStatCtrl.prototype.getDecimalsForValue = function (value) {
                    if (lodash_1.default.isNumber(this.panel.decimals)) {
                        return { decimals: this.panel.decimals, scaledDecimals: null };
                    }
                    var delta = value / 2;
                    var dec = -Math.floor(Math.log(delta) / Math.LN10);
                    var magn = Math.pow(10, -dec);
                    var norm = delta / magn;
                    var size;
                    if (norm < 1.5) {
                        size = 1;
                    }
                    else if (norm < 3) {
                        size = 2;
                        if (norm > 2.25) {
                            size = 2.5;
                            ++dec;
                        }
                    }
                    else if (norm < 7.5) {
                        size = 5;
                    }
                    else {
                        size = 10;
                    }
                    size *= magn;
                    if (Math.floor(value) === value) {
                        dec = 0;
                    }
                    var result = {};
                    result.decimals = Math.max(0, dec);
                    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;
                    return result;
                };
                BlendStatCtrl.prototype.setValues = function (data) {
                    data.flotpairs = [];
                    if (this.series.length > 1) {
                        var error = new Error();
                        error.message = 'Multiple Series Error';
                        error.data =
                            'Metric query returns ' +
                                this.series.length +
                                ' series. Single Stat Panel expects a single series.\n\nResponse:\n' +
                                JSON.stringify(this.series);
                        throw error;
                    }
                    if (this.series && this.series.length > 0) {
                        var lastPoint = lodash_1.default.last(this.series[0].datapoints);
                        var lastValue = lodash_1.default.isArray(lastPoint) ? lastPoint[0] : null;
                        if (this.panel.valueName === 'name') {
                            data.value = 0;
                            data.valueRounded = 0;
                            data.valueFormatted = this.series[0].alias;
                        }
                        else if (lodash_1.default.isString(lastValue)) {
                            data.value = 0;
                            data.valueFormatted = lodash_1.default.escape(lastValue);
                            data.valueRounded = 0;
                        }
                        else if (this.panel.valueName === 'last_time') {
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.value = lastPoint[1];
                            data.valueRounded = data.value;
                            data.valueFormatted = formatFunc(data.value, this.dashboard.isTimezoneUtc());
                        }
                        else {
                            data.value = this.series[0].stats[this.panel.valueName];
                            data.flotpairs = this.series[0].flotpairs;
                            var decimalInfo = this.getDecimalsForValue(data.value);
                            var formatFunc = kbn_1.default.valueFormats[this.panel.format];
                            data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
                            data.valueRounded = kbn_1.default.roundValue(data.value, decimalInfo.decimals);
                        }
                        data.scopedVars['__name'] = { value: this.series[0].label };
                    }
                    this.setValueMapping(data);
                };
                BlendStatCtrl.prototype.setValueMapping = function (data) {
                    if (this.panel.mappingType === 1) {
                        for (var i = 0; i < this.panel.valueMaps.length; i++) {
                            var map = this.panel.valueMaps[i];
                            if (map.value === 'null') {
                                if (data.value === null || data.value === void 0) {
                                    data.valueFormatted = map.text;
                                    return;
                                }
                                continue;
                            }
                            var value = parseFloat(map.value);
                            if (value === data.valueRounded) {
                                data.valueFormatted = map.text;
                                return;
                            }
                        }
                    }
                    else if (this.panel.mappingType === 2) {
                        for (var i = 0; i < this.panel.rangeMaps.length; i++) {
                            var map = this.panel.rangeMaps[i];
                            if (map.from === 'null' && map.to === 'null') {
                                if (data.value === null || data.value === void 0) {
                                    data.valueFormatted = map.text;
                                    return;
                                }
                                continue;
                            }
                            var from = parseFloat(map.from);
                            var to = parseFloat(map.to);
                            if (to >= data.valueRounded && from <= data.valueRounded) {
                                data.valueFormatted = map.text;
                                return;
                            }
                        }
                    }
                    if (data.value === null || data.value === void 0) {
                        data.valueFormatted = 'no value';
                    }
                };
                BlendStatCtrl.prototype.removeValueMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.valueMaps, map);
                    this.panel.valueMaps.splice(index, 1);
                    this.render();
                };
                BlendStatCtrl.prototype.addValueMap = function () {
                    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
                };
                BlendStatCtrl.prototype.removeRangeMap = function (rangeMap) {
                    var index = lodash_1.default.indexOf(this.panel.rangeMaps, rangeMap);
                    this.panel.rangeMaps.splice(index, 1);
                    this.render();
                };
                BlendStatCtrl.prototype.addRangeMap = function () {
                    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
                };
                BlendStatCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    var $location = this.$location;
                    var $timeout = this.$timeout;
                    var $sanitize = this.$sanitize;
                    var panel = ctrl.panel;
                    var templateSrv = this.templateSrv;
                    var data, linkInfo;
                    var $panelContainer = elem.find('.panel-container');
                    elem = elem.find('.singlestat-panel');
                    function applyColoringThresholds(valueString) {
                        var color = getColorForValue(data, data.value);
                        if (color) {
                            return '<span style="color:' + color + '">' + valueString + '</span>';
                        }
                        return valueString;
                    }
                    function getSpan(className, fontSize, applyColoring, value) {
                        value = $sanitize(templateSrv.replace(value, data.scopedVars));
                        value = applyColoring ? applyColoringThresholds(value) : value;
                        return '<span class="' + className + '" style="font-size:' + fontSize + '">' + value + '</span>';
                    }
                    function getBigValueHtml() {
                        var body = '<div class="singlestat-panel-value-container">';
                        if (panel.prefix) {
                            body += getSpan('singlestat-panel-prefix', panel.prefixFontSize, panel.colorPrefix, panel.prefix);
                        }
                        body += getSpan('singlestat-panel-value', panel.valueFontSize, panel.colorValue, data.valueFormatted);
                        if (panel.postfix) {
                            body += getSpan('singlestat-panel-postfix', panel.postfixFontSize, panel.colorPostfix, panel.postfix);
                        }
                        body += '</div>';
                        return body;
                    }
                    function getValueText() {
                        var result = panel.prefix ? templateSrv.replace(panel.prefix, data.scopedVars) : '';
                        result += data.valueFormatted;
                        result += panel.postfix ? templateSrv.replace(panel.postfix, data.scopedVars) : '';
                        return result;
                    }
                    function addGauge() {
                        var width = elem.width();
                        var height = elem.height();
                        var dimension = Math.min(width, height * 1.3);
                        ctrl.invalidGaugeRange = false;
                        if (panel.gauge.minValue > panel.gauge.maxValue) {
                            ctrl.invalidGaugeRange = true;
                            return;
                        }
                        var plotCanvas = jquery_1.default('<div></div>');
                        var plotCss = {
                            top: '10px',
                            margin: 'auto',
                            position: 'relative',
                            height: height * 0.9 + 'px',
                            width: dimension + 'px',
                        };
                        plotCanvas.css(plotCss);
                        var thresholds = [];
                        for (var i = 0; i < data.thresholds.length; i++) {
                            thresholds.push({
                                value: data.thresholds[i],
                                color: data.colorMap[i],
                            });
                        }
                        thresholds.push({
                            value: panel.gauge.maxValue,
                            color: data.colorMap[data.colorMap.length - 1],
                        });
                        var bgColor = config_1.default.bootData.user.lightTheme ? 'rgb(230,230,230)' : 'rgb(38,38,38)';
                        var fontScale = parseInt(panel.valueFontSize, 10) / 100;
                        var fontSize = Math.min(dimension / 5, 100) * fontScale;
                        var gaugeWidthReduceRatio = panel.gauge.thresholdLabels ? 1.5 : 1;
                        var gaugeWidth = Math.min(dimension / 6, 60) / gaugeWidthReduceRatio;
                        var thresholdMarkersWidth = gaugeWidth / 5;
                        var thresholdLabelFontSize = fontSize / 2.5;
                        var options = {
                            series: {
                                gauges: {
                                    gauge: {
                                        min: panel.gauge.minValue,
                                        max: panel.gauge.maxValue,
                                        background: { color: bgColor },
                                        border: { color: null },
                                        shadow: { show: false },
                                        width: gaugeWidth,
                                    },
                                    frame: { show: false },
                                    label: { show: false },
                                    layout: { margin: 0, thresholdWidth: 0 },
                                    cell: { border: { width: 0 } },
                                    threshold: {
                                        values: thresholds,
                                        label: {
                                            show: panel.gauge.thresholdLabels,
                                            margin: thresholdMarkersWidth + 1,
                                            font: { size: thresholdLabelFontSize },
                                        },
                                        show: panel.gauge.thresholdMarkers,
                                        width: thresholdMarkersWidth,
                                    },
                                    value: {
                                        color: panel.colorValue ? getColorForValue(data, data.valueRounded) : null,
                                        formatter: function () {
                                            return getValueText();
                                        },
                                        font: {
                                            size: fontSize,
                                            family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                        },
                                    },
                                    show: true,
                                },
                            },
                        };
                        elem.append(plotCanvas);
                        var plotSeries = {
                            data: [[0, data.value]],
                        };
                        jquery_1.default.plot(plotCanvas, [plotSeries], options);
                    }
                    function addSparkline() {
                        var width = elem.width() + 20;
                        if (width < 30) {
                            setTimeout(addSparkline, 30);
                            return;
                        }
                        var height = ctrl.height;
                        var plotCanvas = jquery_1.default('<div></div>');
                        var plotCss = {};
                        plotCss.position = 'absolute';
                        if (panel.sparkline.full) {
                            plotCss.bottom = '5px';
                            plotCss.left = '-5px';
                            plotCss.width = width - 10 + 'px';
                            var dynamicHeightMargin = height <= 100 ? 5 : Math.round(height / 100) * 15 + 5;
                            plotCss.height = height - dynamicHeightMargin + 'px';
                        }
                        else {
                            plotCss.bottom = '0px';
                            plotCss.left = '-5px';
                            plotCss.width = width - 10 + 'px';
                            plotCss.height = Math.floor(height * 0.25) + 'px';
                        }
                        plotCanvas.css(plotCss);
                        var options = {
                            legend: { show: false },
                            series: {
                                lines: {
                                    show: true,
                                    fill: 1,
                                    zero: false,
                                    lineWidth: 1,
                                    fillColor: panel.sparkline.fillColor,
                                },
                            },
                            yaxes: { show: false },
                            xaxis: {
                                show: false,
                                mode: 'time',
                                min: ctrl.range.from.valueOf(),
                                max: ctrl.range.to.valueOf(),
                            },
                            grid: { hoverable: false, show: false },
                        };
                        elem.append(plotCanvas);
                        var plotSeries = {
                            data: data.flotpairs,
                            color: panel.sparkline.lineColor,
                        };
                        jquery_1.default.plot(plotCanvas, [plotSeries], options);
                    }
                    function render() {
                        if (!ctrl.data) {
                            return;
                        }
                        data = ctrl.data;
                        data.thresholds = panel.thresholds.split(',').map(function (strVale) {
                            return Number(strVale.trim());
                        });
                        data.colorMap = panel.colors;
                        var body = panel.gauge.show ? '' : getBigValueHtml();
                        if (panel.colorBackground) {
                            var color = getColorForValue(data, data.value);
                            if (color) {
                                $panelContainer.css('background-color', color);
                                if (scope.fullscreen) {
                                    elem.css('background-color', color);
                                }
                                else {
                                    elem.css('background-color', '');
                                }
                            }
                        }
                        else {
                            $panelContainer.css('background-color', '');
                            elem.css('background-color', '');
                        }
                        elem.html(body);
                        if (panel.sparkline.show) {
                            addSparkline();
                        }
                        if (panel.gauge.show) {
                            addGauge();
                        }
                        elem.toggleClass('pointer', panel.links.length > 0);
                        if (panel.links.length > 0) {
                            linkInfo = null;
                        }
                        else {
                            linkInfo = null;
                        }
                    }
                    function hookupDrilldownLinkTooltip() {
                        var drilldownTooltip = jquery_1.default('<div id="tooltip" class="">hello</div>"');
                        elem.mouseleave(function () {
                            if (panel.links.length === 0) {
                                return;
                            }
                            $timeout(function () {
                                drilldownTooltip.detach();
                            });
                        });
                        elem.click(function (evt) {
                            if (!linkInfo) {
                                return;
                            }
                            if (jquery_1.default(evt).parents('.panel-header').length > 0) {
                                return;
                            }
                            if (linkInfo.target === '_blank') {
                                window.open(linkInfo.href, '_blank');
                                return;
                            }
                            if (linkInfo.href.indexOf('http') === 0) {
                                window.location.href = linkInfo.href;
                            }
                            else {
                                $timeout(function () {
                                    $location.url(linkInfo.href);
                                });
                            }
                            drilldownTooltip.detach();
                        });
                        elem.mousemove(function (e) {
                            if (!linkInfo) {
                                return;
                            }
                            drilldownTooltip.text('click to go to: ' + linkInfo.title);
                            drilldownTooltip.place_tt(e.pageX, e.pageY - 50);
                        });
                    }
                    hookupDrilldownLinkTooltip();
                    this.events.on('render', function () {
                        render();
                        ctrl.renderingCompleted();
                    });
                };
                BlendStatCtrl.templateUrl = 'module.html';
                return BlendStatCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("BlendStatCtrl", BlendStatCtrl);
            exports_1("PanelCtrl", BlendStatCtrl);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQXd4QkEsMEJBQTBCLElBQUksRUFBRSxLQUFLO1FBQ25DLElBQUksQ0FBQyxnQkFBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN0QixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekI7U0FDRjtRQUVELE9BQU8sZ0JBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkE1dkIyQixpQ0FBZ0I7Z0JBMkUxQyx1QkFBWSxNQUFNLEVBQUUsU0FBUyxFQUFVLFNBQVMsRUFBVSxTQUFTO29CQUFuRSxZQUVFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FVekI7b0JBWnNDLGVBQVMsR0FBVCxTQUFTLENBQUE7b0JBQVUsZUFBUyxHQUFULFNBQVMsQ0FBQTtvQkF4RW5FLGNBQVEsR0FBRyxZQUFZLENBQUM7b0JBUXhCLHNCQUFnQixHQUFVO3dCQUN4QixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTt3QkFDN0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7d0JBQzdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFF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ckMsT0FBTzs2QkFDUjs0QkFFRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQ0FDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzs2QkFDdEM7aUNBQU07Z0NBQ0wsUUFBUSxDQUFDO29DQUNQLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUMvQixDQUFDLENBQUMsQ0FBQzs2QkFDSjs0QkFFRCxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFDNUIsQ0FBQyxDQUFDLENBQUM7d0JBRUgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7NEJBQ2QsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQ0FDYixPQUFPOzZCQUNSOzRCQUVELGdCQUFnQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQzNELGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQ25ELENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUM7b0JBRUQsMEJBQTBCLEVBQUUsQ0FBQztvQkFFN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO3dCQUN2QixNQUFNLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDNUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkE1dUJNLHlCQUFXLEdBQUcsYUFBYSxDQUFDO2dCQTZ1QnJDLG9CQUFDO2FBQUEsQUE5dUJELENBQTRCLHNCQUFnQjs7O1FBK3ZCNUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbi8vIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTYgR3JhZmFuYVxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuLy8gY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuLy8gU09GVFdBUkUuXG5cbmltcG9ydCAnanF1ZXJ5LmZsb3QnO1xuaW1wb3J0ICcuL2xpYi9mbG90L2pxdWVyeS5mbG90LmdhdWdlJztcbmltcG9ydCAnanF1ZXJ5LmZsb3QudGltZSc7XG5pbXBvcnQgJ2pxdWVyeS5mbG90LmNyb3NzaGFpcic7XG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuLy8gaW1wb3J0ICd2ZW5kb3IvZmxvdC9qcXVlcnkuZmxvdCc7XG4vLyBpbXBvcnQgJ3ZlbmRvci9mbG90L2pxdWVyeS5mbG90LmdhdWdlJztcbi8vIGltcG9ydCAnYXBwL2ZlYXR1cmVzL2Rhc2hib2FyZC9wYW5lbGxpbmtzL2xpbmtfc3J2JztcblxuaW1wb3J0IGtibiBmcm9tICdhcHAvY29yZS91dGlscy9rYm4nO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdhcHAvY29yZS9jb25maWcnO1xuaW1wb3J0IFRpbWVTZXJpZXMgZnJvbSAnYXBwL2NvcmUvdGltZV9zZXJpZXMyJztcbmltcG9ydCB7IE1ldHJpY3NQYW5lbEN0cmwgfSBmcm9tICdhcHAvcGx1Z2lucy9zZGsnO1xuXG5jbGFzcyBCbGVuZFN0YXRDdHJsIGV4dGVuZHMgTWV0cmljc1BhbmVsQ3RybCB7XG4gIHN0YXRpYyB0ZW1wbGF0ZVVybCA9ICdtb2R1bGUuaHRtbCc7XG5cbiAgZGF0YVR5cGUgPSAndGltZXNlcmllcyc7XG4gIHNlcmllczogYW55W107XG4gIGRhdGE6IGFueTtcbiAgZm9udFNpemVzOiBhbnlbXTtcbiAgdW5pdEZvcm1hdHM6IGFueVtdO1xuICBpbnZhbGlkR2F1Z2VSYW5nZTogYm9vbGVhbjtcbiAgcGFuZWw6IGFueTtcbiAgZXZlbnRzOiBhbnk7XG4gIHZhbHVlTmFtZU9wdGlvbnM6IGFueVtdID0gW1xuICAgIHsgdmFsdWU6ICdtaW4nLCB0ZXh0OiAnTWluJyB9LFxuICAgIHsgdmFsdWU6ICdtYXgnLCB0ZXh0OiAnTWF4JyB9LFxuICAgIHsgdmFsdWU6ICdhdmcnLCB0ZXh0OiAnQXZlcmFnZScgfSxcbiAgICB7IHZhbHVlOiAnY3VycmVudCcsIHRleHQ6ICdDdXJyZW50JyB9LFxuICAgIHsgdmFsdWU6ICd0b3RhbCcsIHRleHQ6ICdUb3RhbCcgfSxcbiAgICB7IHZhbHVlOiAnbmFtZScsIHRleHQ6ICdOYW1lJyB9LFxuICAgIHsgdmFsdWU6ICdmaXJzdCcsIHRleHQ6ICdGaXJzdCcgfSxcbiAgICB7IHZhbHVlOiAnZGVsdGEnLCB0ZXh0OiAnRGVsdGEnIH0sXG4gICAgeyB2YWx1ZTogJ2RpZmYnLCB0ZXh0OiAnRGlmZmVyZW5jZScgfSxcbiAgICB7IHZhbHVlOiAncmFuZ2UnLCB0ZXh0OiAnUmFuZ2UnIH0sXG4gICAgeyB2YWx1ZTogJ2xhc3RfdGltZScsIHRleHQ6ICdUaW1lIG9mIGxhc3QgcG9pbnQnIH0sXG4gIF07XG4gIGJsZW5kTmFtZU9wdGlvbnM6IGFueVtdID0gW1xuICAgIHsgdmFsdWU6ICdtaW4nLCB0ZXh0OiAnTWluJyB9LFxuICAgIHsgdmFsdWU6ICdtYXgnLCB0ZXh0OiAnTWF4JyB9LFxuICAgIHsgdmFsdWU6ICdhdmcnLCB0ZXh0OiAnQXZlcmFnZScgfSxcbiAgICB7IHZhbHVlOiAndG90YWwnLCB0ZXh0OiAnVG90YWwnIH0sXG4gIF07XG4gIHRhYmxlQ29sdW1uT3B0aW9uczogYW55O1xuXG4gIC8vIFNldCBhbmQgcG9wdWxhdGUgZGVmYXVsdHNcbiAgcGFuZWxEZWZhdWx0cyA9IHtcbiAgICBsaW5rczogW10sXG4gICAgZGF0YXNvdXJjZTogbnVsbCxcbiAgICBtYXhEYXRhUG9pbnRzOiAxMDAsXG4gICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgdGFyZ2V0czogW3t9XSxcbiAgICBjYWNoZVRpbWVvdXQ6IG51bGwsXG4gICAgZm9ybWF0OiAnbm9uZScsXG4gICAgcHJlZml4OiAnJyxcbiAgICBwb3N0Zml4OiAnJyxcbiAgICBudWxsVGV4dDogbnVsbCxcbiAgICB2YWx1ZU1hcHM6IFt7IHZhbHVlOiAnbnVsbCcsIG9wOiAnPScsIHRleHQ6ICdOL0EnIH1dLFxuICAgIG1hcHBpbmdUeXBlczogW3sgbmFtZTogJ3ZhbHVlIHRvIHRleHQnLCB2YWx1ZTogMSB9LCB7IG5hbWU6ICdyYW5nZSB0byB0ZXh0JywgdmFsdWU6IDIgfV0sXG4gICAgcmFuZ2VNYXBzOiBbeyBmcm9tOiAnbnVsbCcsIHRvOiAnbnVsbCcsIHRleHQ6ICdOL0EnIH1dLFxuICAgIG1hcHBpbmdUeXBlOiAxLFxuICAgIG51bGxQb2ludE1vZGU6ICdjb25uZWN0ZWQnLFxuICAgIHZhbHVlTmFtZTogJ2F2ZycsXG4gICAgYmxlbmROYW1lOiAndG90YWwnLFxuICAgIHByZWZpeEZvbnRTaXplOiAnNTAlJyxcbiAgICB2YWx1ZUZvbnRTaXplOiAnODAlJyxcbiAgICBwb3N0Zml4Rm9udFNpemU6ICc1MCUnLFxuICAgIHRocmVzaG9sZHM6ICcnLFxuICAgIGNvbG9yQmFja2dyb3VuZDogZmFsc2UsXG4gICAgY29sb3JWYWx1ZTogZmFsc2UsXG4gICAgY29sb3JzOiBbJyMyOTljNDYnLCAncmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpJywgJyNkNDRhM2EnXSxcbiAgICBzcGFya2xpbmU6IHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgZnVsbDogZmFsc2UsXG4gICAgICBsaW5lQ29sb3I6ICdyZ2IoMzEsIDEyMCwgMTkzKScsXG4gICAgICBmaWxsQ29sb3I6ICdyZ2JhKDMxLCAxMTgsIDE4OSwgMC4xOCknLFxuICAgIH0sXG4gICAgZ2F1Z2U6IHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgbWluVmFsdWU6IDAsXG4gICAgICBtYXhWYWx1ZTogMTAwLFxuICAgICAgdGhyZXNob2xkTWFya2VyczogdHJ1ZSxcbiAgICAgIHRocmVzaG9sZExhYmVsczogZmFsc2UsXG4gICAgfSxcbiAgICB0YWJsZUNvbHVtbjogJycsXG4gIH07XG5cbiAgLyoqIEBuZ0luamVjdCAqL1xuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRpbmplY3RvciwgcHJpdmF0ZSAkc2FuaXRpemUsIHByaXZhdGUgJGxvY2F0aW9uKSB7XG4gICAgLy8gcHJpdmF0ZSBsaW5rU3J2LFxuICAgIHN1cGVyKCRzY29wZSwgJGluamVjdG9yKTtcbiAgICBfLmRlZmF1bHRzKHRoaXMucGFuZWwsIHRoaXMucGFuZWxEZWZhdWx0cyk7XG5cbiAgICB0aGlzLmV2ZW50cy5vbignZGF0YS1yZWNlaXZlZCcsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5ldmVudHMub24oJ2RhdGEtZXJyb3InLCB0aGlzLm9uRGF0YUVycm9yLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdkYXRhLXNuYXBzaG90LWxvYWQnLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZXZlbnRzLm9uKCdpbml0LWVkaXQtbW9kZScsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UgPSB0aGlzLm9uU3BhcmtsaW5lQ29sb3JDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uU3BhcmtsaW5lRmlsbENoYW5nZSA9IHRoaXMub25TcGFya2xpbmVGaWxsQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBvbkluaXRFZGl0TW9kZSgpIHtcbiAgICB0aGlzLmZvbnRTaXplcyA9IFsnMjAlJywgJzMwJScsICc1MCUnLCAnNzAlJywgJzgwJScsICcxMDAlJywgJzExMCUnLCAnMTIwJScsICcxNTAlJywgJzE3MCUnLCAnMjAwJSddO1xuICAgIHRoaXMuYWRkRWRpdG9yVGFiKCdPcHRpb25zJywgJ3B1YmxpYy9wbHVnaW5zL2ZhcnNraS1ibGVuZHN0YXQtcGFuZWwvZWRpdG9yLmh0bWwnLCAyKTtcbiAgICB0aGlzLmFkZEVkaXRvclRhYignVmFsdWUgTWFwcGluZ3MnLCAncHVibGljL3BsdWdpbnMvZmFyc2tpLWJsZW5kc3RhdC1wYW5lbC9tYXBwaW5ncy5odG1sJywgMyk7XG4gICAgdGhpcy5hZGRFZGl0b3JUYWIoJ0JsZW5kaW5nJywgJ3B1YmxpYy9wbHVnaW5zL2ZhcnNraS1ibGVuZHN0YXQtcGFuZWwvYmxlbmRpbmcuaHRtbCcsIDQpO1xuICAgIHRoaXMudW5pdEZvcm1hdHMgPSBrYm4uZ2V0VW5pdEZvcm1hdHMoKTtcbiAgfVxuXG4gIHNldFVuaXRGb3JtYXQoc3ViSXRlbSkge1xuICAgIHRoaXMucGFuZWwuZm9ybWF0ID0gc3ViSXRlbS52YWx1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9uRGF0YUVycm9yKGVycikge1xuICAgIHRoaXMub25EYXRhUmVjZWl2ZWQoW10pO1xuICB9XG5cbiAgb25EYXRhUmVjZWl2ZWQoZGF0YUxpc3QpIHtcbiAgICBpZiAoZGF0YUxpc3QubGVuZ3RoID4gMSkge1xuXG4gICAgICBjb25zdCB0aW1lc3RhbXBzID0ge307XG4gICAgICBjb25zdCBjb3VudHMgPSB7fVxuXG4gICAgICBmb3IgKGxldCBzZXJpZXMgb2YgZGF0YUxpc3QpIHtcbiAgICAgICAgZm9yIChsZXQgcG9pbnQgb2Ygc2VyaWVzLmRhdGFwb2ludHMpIHtcbiAgICAgICAgICBpZiAodGltZXN0YW1wc1twb2ludFsxXV0pIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5wYW5lbC5ibGVuZE5hbWUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnbWluJzpcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRbMF0gPCB0aW1lc3RhbXBzW3BvaW50WzFdXSkge1xuICAgICAgICAgICAgICAgICAgdGltZXN0YW1wc1twb2ludFsxXV0gPSBwb2ludFswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ21heCc6XG4gICAgICAgICAgICAgICAgaWYgKHBvaW50WzBdID4gdGltZXN0YW1wc1twb2ludFsxXV0pIHtcbiAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcHNbcG9pbnRbMV1dID0gcG9pbnRbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdhdmcnOlxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcHNbcG9pbnRbMV1dID0gKHRpbWVzdGFtcHNbcG9pbnRbMV1dICogY291bnRzW3BvaW50WzFdXSArIHBvaW50WzBdKSAvIChjb3VudHNbcG9pbnRbMV1dICsgMSk7XG5cbiAgICAgICAgICAgICAgICBjb3VudHNbcG9pbnRbMV1dICs9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBpcyB0b3RhbFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcHNbcG9pbnRbMV1dICs9IHBvaW50WzBdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lc3RhbXBzW3BvaW50WzFdXSA9IHBvaW50WzBdO1xuICAgICAgICAgICAgY291bnRzW3BvaW50WzFdXSA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRhdGFwb2ludHMgPSBPYmplY3Qua2V5cyh0aW1lc3RhbXBzKS5zb3J0KCkubWFwKHRzID0+IHtcbiAgICAgICAgcmV0dXJuIFt0aW1lc3RhbXBzW3RzXSwgdHNdXG4gICAgICB9KTtcblxuICAgICAgZGF0YUxpc3QgPSBbeyB0YXJnZXQ6ICdCbGVuZGVkX01ldHJpY3MnLCBkYXRhcG9pbnRzIH1dO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGE6IGFueSA9IHtcbiAgICAgIHNjb3BlZFZhcnM6IF8uZXh0ZW5kKHt9LCB0aGlzLnBhbmVsLnNjb3BlZFZhcnMpLFxuICAgIH07XG5cbiAgICBpZiAoZGF0YUxpc3QubGVuZ3RoID4gMCAmJiBkYXRhTGlzdFswXS50eXBlID09PSAndGFibGUnKSB7XG4gICAgICB0aGlzLmRhdGFUeXBlID0gJ3RhYmxlJztcbiAgICAgIGNvbnN0IHRhYmxlRGF0YSA9IGRhdGFMaXN0Lm1hcCh0aGlzLnRhYmxlSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuc2V0VGFibGVWYWx1ZXModGFibGVEYXRhLCBkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhVHlwZSA9ICd0aW1lc2VyaWVzJztcbiAgICAgIHRoaXMuc2VyaWVzID0gZGF0YUxpc3QubWFwKHRoaXMuc2VyaWVzSGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuc2V0VmFsdWVzKGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNlcmllc0hhbmRsZXIoc2VyaWVzRGF0YSkge1xuICAgIGNvbnN0IHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyB8fCBbXSxcbiAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICB9KTtcblxuICAgIHNlcmllcy5mbG90cGFpcnMgPSBzZXJpZXMuZ2V0RmxvdFBhaXJzKHRoaXMucGFuZWwubnVsbFBvaW50TW9kZSk7XG4gICAgcmV0dXJuIHNlcmllcztcbiAgfVxuXG4gIHRhYmxlSGFuZGxlcih0YWJsZURhdGEpIHtcbiAgICBjb25zdCBkYXRhcG9pbnRzID0gW107XG4gICAgY29uc3QgY29sdW1uTmFtZXMgPSB7fTtcblxuICAgIHRhYmxlRGF0YS5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgIGNvbHVtbk5hbWVzW2NvbHVtbkluZGV4XSA9IGNvbHVtbi50ZXh0O1xuICAgIH0pO1xuXG4gICAgdGhpcy50YWJsZUNvbHVtbk9wdGlvbnMgPSBjb2x1bW5OYW1lcztcbiAgICBpZiAoIV8uZmluZCh0YWJsZURhdGEuY29sdW1ucywgWyd0ZXh0JywgdGhpcy5wYW5lbC50YWJsZUNvbHVtbl0pKSB7XG4gICAgICB0aGlzLnNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKTtcbiAgICB9XG5cbiAgICB0YWJsZURhdGEucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICBjb25zdCBkYXRhcG9pbnQgPSB7fTtcblxuICAgICAgcm93LmZvckVhY2goKHZhbHVlLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBjb2x1bW5OYW1lc1tjb2x1bW5JbmRleF07XG4gICAgICAgIGRhdGFwb2ludFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcblxuICAgICAgZGF0YXBvaW50cy5wdXNoKGRhdGFwb2ludCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXBvaW50cztcbiAgfVxuXG4gIHNldFRhYmxlQ29sdW1uVG9TZW5zaWJsZURlZmF1bHQodGFibGVEYXRhKSB7XG4gICAgaWYgKHRhYmxlRGF0YS5jb2x1bW5zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5wYW5lbC50YWJsZUNvbHVtbiA9IHRhYmxlRGF0YS5jb2x1bW5zWzBdLnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwudGFibGVDb2x1bW4gPSBfLmZpbmQodGFibGVEYXRhLmNvbHVtbnMsIGNvbCA9PiB7XG4gICAgICAgIHJldHVybiBjb2wudHlwZSAhPT0gJ3RpbWUnO1xuICAgICAgfSkudGV4dDtcbiAgICB9XG4gIH1cblxuICBzZXRUYWJsZVZhbHVlcyh0YWJsZURhdGEsIGRhdGEpIHtcbiAgICBpZiAoIXRhYmxlRGF0YSB8fCB0YWJsZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRhYmxlRGF0YVswXS5sZW5ndGggPT09IDAgfHwgdGFibGVEYXRhWzBdWzBdW3RoaXMucGFuZWwudGFibGVDb2x1bW5dID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhcG9pbnQgPSB0YWJsZURhdGFbMF1bMF07XG4gICAgZGF0YS52YWx1ZSA9IGRhdGFwb2ludFt0aGlzLnBhbmVsLnRhYmxlQ29sdW1uXTtcblxuICAgIGlmIChfLmlzU3RyaW5nKGRhdGEudmFsdWUpKSB7XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gXy5lc2NhcGUoZGF0YS52YWx1ZSk7XG4gICAgICBkYXRhLnZhbHVlID0gMDtcbiAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGVjaW1hbEluZm8gPSB0aGlzLmdldERlY2ltYWxzRm9yVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICBjb25zdCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICBkYXRhLnZhbHVlRm9ybWF0dGVkID0gZm9ybWF0RnVuYyhcbiAgICAgICAgZGF0YXBvaW50W3RoaXMucGFuZWwudGFibGVDb2x1bW5dLFxuICAgICAgICBkZWNpbWFsSW5mby5kZWNpbWFscyxcbiAgICAgICAgZGVjaW1hbEluZm8uc2NhbGVkRGVjaW1hbHNcbiAgICAgICk7XG4gICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IGtibi5yb3VuZFZhbHVlKGRhdGEudmFsdWUsIHRoaXMucGFuZWwuZGVjaW1hbHMgfHwgMCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRWYWx1ZU1hcHBpbmcoZGF0YSk7XG4gIH1cblxuICBjYW5Nb2RpZnlUZXh0KCkge1xuICAgIHJldHVybiAhdGhpcy5wYW5lbC5nYXVnZS5zaG93O1xuICB9XG5cbiAgc2V0Q29sb3Jpbmcob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmJhY2tncm91bmQpIHtcbiAgICAgIHRoaXMucGFuZWwuY29sb3JWYWx1ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5wYW5lbC5jb2xvcnMgPSBbJ3JnYmEoNzEsIDIxMiwgNTksIDAuNCknLCAncmdiYSgyNDUsIDE1MCwgNDAsIDAuNzMpJywgJ3JnYmEoMjI1LCA0MCwgNDAsIDAuNTkpJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwuY29sb3JCYWNrZ3JvdW5kID0gZmFsc2U7XG4gICAgICB0aGlzLnBhbmVsLmNvbG9ycyA9IFsncmdiYSg1MCwgMTcyLCA0NSwgMC45NyknLCAncmdiYSgyMzcsIDEyOSwgNDAsIDAuODkpJywgJ3JnYmEoMjQ1LCA1NCwgNTQsIDAuOSknXTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGludmVydENvbG9yT3JkZXIoKSB7XG4gICAgY29uc3QgdG1wID0gdGhpcy5wYW5lbC5jb2xvcnNbMF07XG4gICAgdGhpcy5wYW5lbC5jb2xvcnNbMF0gPSB0aGlzLnBhbmVsLmNvbG9yc1syXTtcbiAgICB0aGlzLnBhbmVsLmNvbG9yc1syXSA9IHRtcDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgb25Db2xvckNoYW5nZShwYW5lbENvbG9ySW5kZXgpIHtcbiAgICByZXR1cm4gY29sb3IgPT4ge1xuICAgICAgdGhpcy5wYW5lbC5jb2xvcnNbcGFuZWxDb2xvckluZGV4XSA9IGNvbG9yO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9O1xuICB9XG5cbiAgb25TcGFya2xpbmVDb2xvckNoYW5nZShuZXdDb2xvcikge1xuICAgIHRoaXMucGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvciA9IG5ld0NvbG9yO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBvblNwYXJrbGluZUZpbGxDaGFuZ2UobmV3Q29sb3IpIHtcbiAgICB0aGlzLnBhbmVsLnNwYXJrbGluZS5maWxsQ29sb3IgPSBuZXdDb2xvcjtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZ2V0RGVjaW1hbHNGb3JWYWx1ZSh2YWx1ZSkge1xuICAgIGlmIChfLmlzTnVtYmVyKHRoaXMucGFuZWwuZGVjaW1hbHMpKSB7XG4gICAgICByZXR1cm4geyBkZWNpbWFsczogdGhpcy5wYW5lbC5kZWNpbWFscywgc2NhbGVkRGVjaW1hbHM6IG51bGwgfTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWx0YSA9IHZhbHVlIC8gMjtcbiAgICBsZXQgZGVjID0gLU1hdGguZmxvb3IoTWF0aC5sb2coZGVsdGEpIC8gTWF0aC5MTjEwKTtcblxuICAgIGNvbnN0IG1hZ24gPSBNYXRoLnBvdygxMCwgLWRlYyk7XG4gICAgY29uc3Qgbm9ybSA9IGRlbHRhIC8gbWFnbjsgLy8gbm9ybSBpcyBiZXR3ZWVuIDEuMCBhbmQgMTAuMFxuICAgIGxldCBzaXplO1xuXG4gICAgaWYgKG5vcm0gPCAxLjUpIHtcbiAgICAgIHNpemUgPSAxO1xuICAgIH0gZWxzZSBpZiAobm9ybSA8IDMpIHtcbiAgICAgIHNpemUgPSAyO1xuICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciAyLjUsIHJlcXVpcmVzIGFuIGV4dHJhIGRlY2ltYWxcbiAgICAgIGlmIChub3JtID4gMi4yNSkge1xuICAgICAgICBzaXplID0gMi41O1xuICAgICAgICArK2RlYztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vcm0gPCA3LjUpIHtcbiAgICAgIHNpemUgPSA1O1xuICAgIH0gZWxzZSB7XG4gICAgICBzaXplID0gMTA7XG4gICAgfVxuXG4gICAgc2l6ZSAqPSBtYWduO1xuXG4gICAgLy8gcmVkdWNlIHN0YXJ0aW5nIGRlY2ltYWxzIGlmIG5vdCBuZWVkZWRcbiAgICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlKSB7XG4gICAgICBkZWMgPSAwO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XG4gICAgcmVzdWx0LmRlY2ltYWxzID0gTWF0aC5tYXgoMCwgZGVjKTtcbiAgICByZXN1bHQuc2NhbGVkRGVjaW1hbHMgPSByZXN1bHQuZGVjaW1hbHMgLSBNYXRoLmZsb29yKE1hdGgubG9nKHNpemUpIC8gTWF0aC5MTjEwKSArIDI7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc2V0VmFsdWVzKGRhdGEpIHtcbiAgICBkYXRhLmZsb3RwYWlycyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuc2VyaWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IGVycm9yOiBhbnkgPSBuZXcgRXJyb3IoKTtcbiAgICAgIGVycm9yLm1lc3NhZ2UgPSAnTXVsdGlwbGUgU2VyaWVzIEVycm9yJztcbiAgICAgIGVycm9yLmRhdGEgPVxuICAgICAgICAnTWV0cmljIHF1ZXJ5IHJldHVybnMgJyArXG4gICAgICAgIHRoaXMuc2VyaWVzLmxlbmd0aCArXG4gICAgICAgICcgc2VyaWVzLiBTaW5nbGUgU3RhdCBQYW5lbCBleHBlY3RzIGEgc2luZ2xlIHNlcmllcy5cXG5cXG5SZXNwb25zZTpcXG4nICtcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5zZXJpZXMpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VyaWVzICYmIHRoaXMuc2VyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGxhc3RQb2ludCA9IF8ubGFzdCh0aGlzLnNlcmllc1swXS5kYXRhcG9pbnRzKTtcbiAgICAgIGNvbnN0IGxhc3RWYWx1ZSA9IF8uaXNBcnJheShsYXN0UG9pbnQpID8gbGFzdFBvaW50WzBdIDogbnVsbDtcblxuICAgICAgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbmFtZScpIHtcbiAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gMDtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IHRoaXMuc2VyaWVzWzBdLmFsaWFzO1xuICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxhc3RWYWx1ZSkpIHtcbiAgICAgICAgZGF0YS52YWx1ZSA9IDA7XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBfLmVzY2FwZShsYXN0VmFsdWUpO1xuICAgICAgICBkYXRhLnZhbHVlUm91bmRlZCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWwudmFsdWVOYW1lID09PSAnbGFzdF90aW1lJykge1xuICAgICAgICBjb25zdCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWUgPSBsYXN0UG9pbnRbMV07XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0gZGF0YS52YWx1ZTtcbiAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdEZ1bmMoZGF0YS52YWx1ZSwgdGhpcy5kYXNoYm9hcmQuaXNUaW1lem9uZVV0YygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEudmFsdWUgPSB0aGlzLnNlcmllc1swXS5zdGF0c1t0aGlzLnBhbmVsLnZhbHVlTmFtZV07XG4gICAgICAgIGRhdGEuZmxvdHBhaXJzID0gdGhpcy5zZXJpZXNbMF0uZmxvdHBhaXJzO1xuXG4gICAgICAgIGNvbnN0IGRlY2ltYWxJbmZvID0gdGhpcy5nZXREZWNpbWFsc0ZvclZhbHVlKGRhdGEudmFsdWUpO1xuICAgICAgICBjb25zdCBmb3JtYXRGdW5jID0ga2JuLnZhbHVlRm9ybWF0c1t0aGlzLnBhbmVsLmZvcm1hdF07XG4gICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRGdW5jKGRhdGEudmFsdWUsIGRlY2ltYWxJbmZvLmRlY2ltYWxzLCBkZWNpbWFsSW5mby5zY2FsZWREZWNpbWFscyk7XG4gICAgICAgIGRhdGEudmFsdWVSb3VuZGVkID0ga2JuLnJvdW5kVmFsdWUoZGF0YS52YWx1ZSwgZGVjaW1hbEluZm8uZGVjaW1hbHMpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgJF9fbmFtZSB2YXJpYWJsZSBmb3IgdXNpbmcgaW4gcHJlZml4IG9yIHBvc3RmaXhcbiAgICAgIGRhdGEuc2NvcGVkVmFyc1snX19uYW1lJ10gPSB7IHZhbHVlOiB0aGlzLnNlcmllc1swXS5sYWJlbCB9O1xuICAgIH1cbiAgICB0aGlzLnNldFZhbHVlTWFwcGluZyhkYXRhKTtcbiAgfVxuXG4gIHNldFZhbHVlTWFwcGluZyhkYXRhKSB7XG4gICAgLy8gY2hlY2sgdmFsdWUgdG8gdGV4dCBtYXBwaW5ncyBpZiBpdHMgZW5hYmxlZFxuICAgIGlmICh0aGlzLnBhbmVsLm1hcHBpbmdUeXBlID09PSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFuZWwudmFsdWVNYXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG1hcCA9IHRoaXMucGFuZWwudmFsdWVNYXBzW2ldO1xuICAgICAgICAvLyBzcGVjaWFsIG51bGwgY2FzZVxuICAgICAgICBpZiAobWFwLnZhbHVlID09PSAnbnVsbCcpIHtcbiAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWx1ZS9udW1iZXIgdG8gdGV4dCBtYXBwaW5nXG4gICAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdChtYXAudmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgPT09IGRhdGEudmFsdWVSb3VuZGVkKSB7XG4gICAgICAgICAgZGF0YS52YWx1ZUZvcm1hdHRlZCA9IG1hcC50ZXh0O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbC5tYXBwaW5nVHlwZSA9PT0gMikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhbmVsLnJhbmdlTWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBtYXAgPSB0aGlzLnBhbmVsLnJhbmdlTWFwc1tpXTtcbiAgICAgICAgLy8gc3BlY2lhbCBudWxsIGNhc2VcbiAgICAgICAgaWYgKG1hcC5mcm9tID09PSAnbnVsbCcgJiYgbWFwLnRvID09PSAnbnVsbCcpIHtcbiAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWx1ZS9udW1iZXIgdG8gcmFuZ2UgbWFwcGluZ1xuICAgICAgICBjb25zdCBmcm9tID0gcGFyc2VGbG9hdChtYXAuZnJvbSk7XG4gICAgICAgIGNvbnN0IHRvID0gcGFyc2VGbG9hdChtYXAudG8pO1xuICAgICAgICBpZiAodG8gPj0gZGF0YS52YWx1ZVJvdW5kZWQgJiYgZnJvbSA8PSBkYXRhLnZhbHVlUm91bmRlZCkge1xuICAgICAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSBtYXAudGV4dDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS52YWx1ZSA9PT0gbnVsbCB8fCBkYXRhLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGRhdGEudmFsdWVGb3JtYXR0ZWQgPSAnbm8gdmFsdWUnO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVZhbHVlTWFwKG1hcCkge1xuICAgIGNvbnN0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMucGFuZWwudmFsdWVNYXBzLCBtYXApO1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFZhbHVlTWFwKCkge1xuICAgIHRoaXMucGFuZWwudmFsdWVNYXBzLnB1c2goeyB2YWx1ZTogJycsIG9wOiAnPScsIHRleHQ6ICcnIH0pO1xuICB9XG5cbiAgcmVtb3ZlUmFuZ2VNYXAocmFuZ2VNYXApIHtcbiAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLnBhbmVsLnJhbmdlTWFwcywgcmFuZ2VNYXApO1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFkZFJhbmdlTWFwKCkge1xuICAgIHRoaXMucGFuZWwucmFuZ2VNYXBzLnB1c2goeyBmcm9tOiAnJywgdG86ICcnLCB0ZXh0OiAnJyB9KTtcbiAgfVxuXG4gIGxpbmsoc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XG4gICAgY29uc3QgJGxvY2F0aW9uID0gdGhpcy4kbG9jYXRpb247XG4gICAgLy8gY29uc3QgbGlua1NydiA9IHRoaXMubGlua1NydjtcbiAgICBjb25zdCAkdGltZW91dCA9IHRoaXMuJHRpbWVvdXQ7XG4gICAgY29uc3QgJHNhbml0aXplID0gdGhpcy4kc2FuaXRpemU7XG4gICAgY29uc3QgcGFuZWwgPSBjdHJsLnBhbmVsO1xuICAgIGNvbnN0IHRlbXBsYXRlU3J2ID0gdGhpcy50ZW1wbGF0ZVNydjtcbiAgICBsZXQgZGF0YSwgbGlua0luZm87XG4gICAgY29uc3QgJHBhbmVsQ29udGFpbmVyID0gZWxlbS5maW5kKCcucGFuZWwtY29udGFpbmVyJyk7XG4gICAgZWxlbSA9IGVsZW0uZmluZCgnLnNpbmdsZXN0YXQtcGFuZWwnKTtcblxuICAgIGZ1bmN0aW9uIGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKHZhbHVlU3RyaW5nKSB7XG4gICAgICBjb25zdCBjb2xvciA9IGdldENvbG9yRm9yVmFsdWUoZGF0YSwgZGF0YS52YWx1ZSk7XG4gICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgcmV0dXJuICc8c3BhbiBzdHlsZT1cImNvbG9yOicgKyBjb2xvciArICdcIj4nICsgdmFsdWVTdHJpbmcgKyAnPC9zcGFuPic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZVN0cmluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTcGFuKGNsYXNzTmFtZSwgZm9udFNpemUsIGFwcGx5Q29sb3JpbmcsIHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9ICRzYW5pdGl6ZSh0ZW1wbGF0ZVNydi5yZXBsYWNlKHZhbHVlLCBkYXRhLnNjb3BlZFZhcnMpKTtcbiAgICAgIHZhbHVlID0gYXBwbHlDb2xvcmluZyA/IGFwcGx5Q29sb3JpbmdUaHJlc2hvbGRzKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCIgc3R5bGU9XCJmb250LXNpemU6JyArIGZvbnRTaXplICsgJ1wiPicgKyB2YWx1ZSArICc8L3NwYW4+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCaWdWYWx1ZUh0bWwoKSB7XG4gICAgICBsZXQgYm9keSA9ICc8ZGl2IGNsYXNzPVwic2luZ2xlc3RhdC1wYW5lbC12YWx1ZS1jb250YWluZXJcIj4nO1xuXG4gICAgICBpZiAocGFuZWwucHJlZml4KSB7XG4gICAgICAgIGJvZHkgKz0gZ2V0U3Bhbignc2luZ2xlc3RhdC1wYW5lbC1wcmVmaXgnLCBwYW5lbC5wcmVmaXhGb250U2l6ZSwgcGFuZWwuY29sb3JQcmVmaXgsIHBhbmVsLnByZWZpeCk7XG4gICAgICB9XG5cbiAgICAgIGJvZHkgKz0gZ2V0U3Bhbignc2luZ2xlc3RhdC1wYW5lbC12YWx1ZScsIHBhbmVsLnZhbHVlRm9udFNpemUsIHBhbmVsLmNvbG9yVmFsdWUsIGRhdGEudmFsdWVGb3JtYXR0ZWQpO1xuXG4gICAgICBpZiAocGFuZWwucG9zdGZpeCkge1xuICAgICAgICBib2R5ICs9IGdldFNwYW4oJ3NpbmdsZXN0YXQtcGFuZWwtcG9zdGZpeCcsIHBhbmVsLnBvc3RmaXhGb250U2l6ZSwgcGFuZWwuY29sb3JQb3N0Zml4LCBwYW5lbC5wb3N0Zml4KTtcbiAgICAgIH1cblxuICAgICAgYm9keSArPSAnPC9kaXY+JztcblxuICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVUZXh0KCkge1xuICAgICAgbGV0IHJlc3VsdCA9IHBhbmVsLnByZWZpeCA/IHRlbXBsYXRlU3J2LnJlcGxhY2UocGFuZWwucHJlZml4LCBkYXRhLnNjb3BlZFZhcnMpIDogJyc7XG4gICAgICByZXN1bHQgKz0gZGF0YS52YWx1ZUZvcm1hdHRlZDtcbiAgICAgIHJlc3VsdCArPSBwYW5lbC5wb3N0Zml4ID8gdGVtcGxhdGVTcnYucmVwbGFjZShwYW5lbC5wb3N0Zml4LCBkYXRhLnNjb3BlZFZhcnMpIDogJyc7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkR2F1Z2UoKSB7XG4gICAgICBjb25zdCB3aWR0aCA9IGVsZW0ud2lkdGgoKTtcbiAgICAgIGNvbnN0IGhlaWdodCA9IGVsZW0uaGVpZ2h0KCk7XG4gICAgICAvLyBBbGxvdyB0byB1c2UgYSBiaXQgbW9yZSBzcGFjZSBmb3Igd2lkZSBnYXVnZXNcbiAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQgKiAxLjMpO1xuXG4gICAgICBjdHJsLmludmFsaWRHYXVnZVJhbmdlID0gZmFsc2U7XG4gICAgICBpZiAocGFuZWwuZ2F1Z2UubWluVmFsdWUgPiBwYW5lbC5nYXVnZS5tYXhWYWx1ZSkge1xuICAgICAgICBjdHJsLmludmFsaWRHYXVnZVJhbmdlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwbG90Q2FudmFzID0gJCgnPGRpdj48L2Rpdj4nKTtcbiAgICAgIGNvbnN0IHBsb3RDc3MgPSB7XG4gICAgICAgIHRvcDogJzEwcHgnLFxuICAgICAgICBtYXJnaW46ICdhdXRvJyxcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0ICogMC45ICsgJ3B4JyxcbiAgICAgICAgd2lkdGg6IGRpbWVuc2lvbiArICdweCcsXG4gICAgICB9O1xuXG4gICAgICBwbG90Q2FudmFzLmNzcyhwbG90Q3NzKTtcblxuICAgICAgY29uc3QgdGhyZXNob2xkcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLnRocmVzaG9sZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhyZXNob2xkcy5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogZGF0YS50aHJlc2hvbGRzW2ldLFxuICAgICAgICAgIGNvbG9yOiBkYXRhLmNvbG9yTWFwW2ldLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRocmVzaG9sZHMucHVzaCh7XG4gICAgICAgIHZhbHVlOiBwYW5lbC5nYXVnZS5tYXhWYWx1ZSxcbiAgICAgICAgY29sb3I6IGRhdGEuY29sb3JNYXBbZGF0YS5jb2xvck1hcC5sZW5ndGggLSAxXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBiZ0NvbG9yID0gY29uZmlnLmJvb3REYXRhLnVzZXIubGlnaHRUaGVtZSA/ICdyZ2IoMjMwLDIzMCwyMzApJyA6ICdyZ2IoMzgsMzgsMzgpJztcblxuICAgICAgY29uc3QgZm9udFNjYWxlID0gcGFyc2VJbnQocGFuZWwudmFsdWVGb250U2l6ZSwgMTApIC8gMTAwO1xuICAgICAgY29uc3QgZm9udFNpemUgPSBNYXRoLm1pbihkaW1lbnNpb24gLyA1LCAxMDApICogZm9udFNjYWxlO1xuICAgICAgLy8gUmVkdWNlIGdhdWdlIHdpZHRoIGlmIHRocmVzaG9sZCBsYWJlbHMgZW5hYmxlZFxuICAgICAgY29uc3QgZ2F1Z2VXaWR0aFJlZHVjZVJhdGlvID0gcGFuZWwuZ2F1Z2UudGhyZXNob2xkTGFiZWxzID8gMS41IDogMTtcbiAgICAgIGNvbnN0IGdhdWdlV2lkdGggPSBNYXRoLm1pbihkaW1lbnNpb24gLyA2LCA2MCkgLyBnYXVnZVdpZHRoUmVkdWNlUmF0aW87XG4gICAgICBjb25zdCB0aHJlc2hvbGRNYXJrZXJzV2lkdGggPSBnYXVnZVdpZHRoIC8gNTtcbiAgICAgIGNvbnN0IHRocmVzaG9sZExhYmVsRm9udFNpemUgPSBmb250U2l6ZSAvIDIuNTtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgZ2F1Z2VzOiB7XG4gICAgICAgICAgICBnYXVnZToge1xuICAgICAgICAgICAgICBtaW46IHBhbmVsLmdhdWdlLm1pblZhbHVlLFxuICAgICAgICAgICAgICBtYXg6IHBhbmVsLmdhdWdlLm1heFZhbHVlLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB7IGNvbG9yOiBiZ0NvbG9yIH0sXG4gICAgICAgICAgICAgIGJvcmRlcjogeyBjb2xvcjogbnVsbCB9LFxuICAgICAgICAgICAgICBzaGFkb3c6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgICAgd2lkdGg6IGdhdWdlV2lkdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnJhbWU6IHsgc2hvdzogZmFsc2UgfSxcbiAgICAgICAgICAgIGxhYmVsOiB7IHNob3c6IGZhbHNlIH0sXG4gICAgICAgICAgICBsYXlvdXQ6IHsgbWFyZ2luOiAwLCB0aHJlc2hvbGRXaWR0aDogMCB9LFxuICAgICAgICAgICAgY2VsbDogeyBib3JkZXI6IHsgd2lkdGg6IDAgfSB9LFxuICAgICAgICAgICAgdGhyZXNob2xkOiB7XG4gICAgICAgICAgICAgIHZhbHVlczogdGhyZXNob2xkcyxcbiAgICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgICBzaG93OiBwYW5lbC5nYXVnZS50aHJlc2hvbGRMYWJlbHMsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiB0aHJlc2hvbGRNYXJrZXJzV2lkdGggKyAxLFxuICAgICAgICAgICAgICAgIGZvbnQ6IHsgc2l6ZTogdGhyZXNob2xkTGFiZWxGb250U2l6ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzaG93OiBwYW5lbC5nYXVnZS50aHJlc2hvbGRNYXJrZXJzLFxuICAgICAgICAgICAgICB3aWR0aDogdGhyZXNob2xkTWFya2Vyc1dpZHRoLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiBwYW5lbC5jb2xvclZhbHVlID8gZ2V0Q29sb3JGb3JWYWx1ZShkYXRhLCBkYXRhLnZhbHVlUm91bmRlZCkgOiBudWxsLFxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWVUZXh0KCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgICAgICBzaXplOiBmb250U2l6ZSxcbiAgICAgICAgICAgICAgICBmYW1pbHk6ICdcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGVsZW0uYXBwZW5kKHBsb3RDYW52YXMpO1xuXG4gICAgICBjb25zdCBwbG90U2VyaWVzID0ge1xuICAgICAgICBkYXRhOiBbWzAsIGRhdGEudmFsdWVdXSxcbiAgICAgIH07XG5cbiAgICAgICQucGxvdChwbG90Q2FudmFzLCBbcGxvdFNlcmllc10sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFNwYXJrbGluZSgpIHtcbiAgICAgIGNvbnN0IHdpZHRoID0gZWxlbS53aWR0aCgpICsgMjA7XG4gICAgICBpZiAod2lkdGggPCAzMCkge1xuICAgICAgICAvLyBlbGVtZW50IGhhcyBub3QgZ290dGVuIGl0J3Mgd2lkdGggeWV0XG4gICAgICAgIC8vIGRlbGF5IHNwYXJrbGluZSByZW5kZXJcbiAgICAgICAgc2V0VGltZW91dChhZGRTcGFya2xpbmUsIDMwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoZWlnaHQgPSBjdHJsLmhlaWdodDtcbiAgICAgIGNvbnN0IHBsb3RDYW52YXMgPSAkKCc8ZGl2PjwvZGl2PicpO1xuICAgICAgY29uc3QgcGxvdENzczogYW55ID0ge307XG4gICAgICBwbG90Q3NzLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblxuICAgICAgaWYgKHBhbmVsLnNwYXJrbGluZS5mdWxsKSB7XG4gICAgICAgIHBsb3RDc3MuYm90dG9tID0gJzVweCc7XG4gICAgICAgIHBsb3RDc3MubGVmdCA9ICctNXB4JztcbiAgICAgICAgcGxvdENzcy53aWR0aCA9IHdpZHRoIC0gMTAgKyAncHgnO1xuICAgICAgICBjb25zdCBkeW5hbWljSGVpZ2h0TWFyZ2luID0gaGVpZ2h0IDw9IDEwMCA/IDUgOiBNYXRoLnJvdW5kKGhlaWdodCAvIDEwMCkgKiAxNSArIDU7XG4gICAgICAgIHBsb3RDc3MuaGVpZ2h0ID0gaGVpZ2h0IC0gZHluYW1pY0hlaWdodE1hcmdpbiArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbG90Q3NzLmJvdHRvbSA9ICcwcHgnO1xuICAgICAgICBwbG90Q3NzLmxlZnQgPSAnLTVweCc7XG4gICAgICAgIHBsb3RDc3Mud2lkdGggPSB3aWR0aCAtIDEwICsgJ3B4JztcbiAgICAgICAgcGxvdENzcy5oZWlnaHQgPSBNYXRoLmZsb29yKGhlaWdodCAqIDAuMjUpICsgJ3B4JztcbiAgICAgIH1cblxuICAgICAgcGxvdENhbnZhcy5jc3MocGxvdENzcyk7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGxlZ2VuZDogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBsaW5lczoge1xuICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgIGZpbGw6IDEsXG4gICAgICAgICAgICB6ZXJvOiBmYWxzZSxcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogcGFuZWwuc3BhcmtsaW5lLmZpbGxDb2xvcixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB5YXhlczogeyBzaG93OiBmYWxzZSB9LFxuICAgICAgICB4YXhpczoge1xuICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgIG1vZGU6ICd0aW1lJyxcbiAgICAgICAgICBtaW46IGN0cmwucmFuZ2UuZnJvbS52YWx1ZU9mKCksXG4gICAgICAgICAgbWF4OiBjdHJsLnJhbmdlLnRvLnZhbHVlT2YoKSxcbiAgICAgICAgfSxcbiAgICAgICAgZ3JpZDogeyBob3ZlcmFibGU6IGZhbHNlLCBzaG93OiBmYWxzZSB9LFxuICAgICAgfTtcblxuICAgICAgZWxlbS5hcHBlbmQocGxvdENhbnZhcyk7XG5cbiAgICAgIGNvbnN0IHBsb3RTZXJpZXMgPSB7XG4gICAgICAgIGRhdGE6IGRhdGEuZmxvdHBhaXJzLFxuICAgICAgICBjb2xvcjogcGFuZWwuc3BhcmtsaW5lLmxpbmVDb2xvcixcbiAgICAgIH07XG5cbiAgICAgICQucGxvdChwbG90Q2FudmFzLCBbcGxvdFNlcmllc10sIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIGlmICghY3RybC5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRhdGEgPSBjdHJsLmRhdGE7XG5cbiAgICAgIC8vIGdldCB0aHJlc2hvbGRzXG4gICAgICBkYXRhLnRocmVzaG9sZHMgPSBwYW5lbC50aHJlc2hvbGRzLnNwbGl0KCcsJykubWFwKHN0clZhbGUgPT4ge1xuICAgICAgICByZXR1cm4gTnVtYmVyKHN0clZhbGUudHJpbSgpKTtcbiAgICAgIH0pO1xuICAgICAgZGF0YS5jb2xvck1hcCA9IHBhbmVsLmNvbG9ycztcblxuICAgICAgY29uc3QgYm9keSA9IHBhbmVsLmdhdWdlLnNob3cgPyAnJyA6IGdldEJpZ1ZhbHVlSHRtbCgpO1xuXG4gICAgICBpZiAocGFuZWwuY29sb3JCYWNrZ3JvdW5kKSB7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3JGb3JWYWx1ZShkYXRhLCBkYXRhLnZhbHVlKTtcbiAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgJHBhbmVsQ29udGFpbmVyLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIGNvbG9yKTtcbiAgICAgICAgICBpZiAoc2NvcGUuZnVsbHNjcmVlbikge1xuICAgICAgICAgICAgZWxlbS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBjb2xvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHBhbmVsQ29udGFpbmVyLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICcnKTtcbiAgICAgICAgZWxlbS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGVsZW0uaHRtbChib2R5KTtcblxuICAgICAgaWYgKHBhbmVsLnNwYXJrbGluZS5zaG93KSB7XG4gICAgICAgIGFkZFNwYXJrbGluZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFuZWwuZ2F1Z2Uuc2hvdykge1xuICAgICAgICBhZGRHYXVnZSgpO1xuICAgICAgfVxuXG4gICAgICBlbGVtLnRvZ2dsZUNsYXNzKCdwb2ludGVyJywgcGFuZWwubGlua3MubGVuZ3RoID4gMCk7XG5cbiAgICAgIGlmIChwYW5lbC5saW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIGxpbmtJbmZvID0gbGlua1Nydi5nZXRQYW5lbExpbmtBbmNob3JJbmZvKHBhbmVsLmxpbmtzWzBdLCBkYXRhLnNjb3BlZFZhcnMpO1xuICAgICAgICBsaW5rSW5mbyA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5rSW5mbyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaG9va3VwRHJpbGxkb3duTGlua1Rvb2x0aXAoKSB7XG4gICAgICAvLyBkcmlsbGRvd24gbGluayB0b29sdGlwXG4gICAgICBjb25zdCBkcmlsbGRvd25Ub29sdGlwID0gJCgnPGRpdiBpZD1cInRvb2x0aXBcIiBjbGFzcz1cIlwiPmhlbGxvPC9kaXY+XCInKTtcblxuICAgICAgZWxlbS5tb3VzZWxlYXZlKCgpID0+IHtcbiAgICAgICAgaWYgKHBhbmVsLmxpbmtzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZHJpbGxkb3duVG9vbHRpcC5kZXRhY2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZWxlbS5jbGljayhldnQgPT4ge1xuICAgICAgICBpZiAoIWxpbmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlnbm9yZSB0aXRsZSBjbGlja3MgaW4gdGl0bGVcbiAgICAgICAgaWYgKCQoZXZ0KS5wYXJlbnRzKCcucGFuZWwtaGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW5rSW5mby50YXJnZXQgPT09ICdfYmxhbmsnKSB7XG4gICAgICAgICAgd2luZG93Lm9wZW4obGlua0luZm8uaHJlZiwgJ19ibGFuaycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW5rSW5mby5ocmVmLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGlua0luZm8uaHJlZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkbG9jYXRpb24udXJsKGxpbmtJbmZvLmhyZWYpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJpbGxkb3duVG9vbHRpcC5kZXRhY2goKTtcbiAgICAgIH0pO1xuXG4gICAgICBlbGVtLm1vdXNlbW92ZShlID0+IHtcbiAgICAgICAgaWYgKCFsaW5rSW5mbykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyaWxsZG93blRvb2x0aXAudGV4dCgnY2xpY2sgdG8gZ28gdG86ICcgKyBsaW5rSW5mby50aXRsZSk7XG4gICAgICAgIGRyaWxsZG93blRvb2x0aXAucGxhY2VfdHQoZS5wYWdlWCwgZS5wYWdlWSAtIDUwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhvb2t1cERyaWxsZG93bkxpbmtUb29sdGlwKCk7XG5cbiAgICB0aGlzLmV2ZW50cy5vbigncmVuZGVyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBjdHJsLnJlbmRlcmluZ0NvbXBsZXRlZCgpO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbG9yRm9yVmFsdWUoZGF0YSwgdmFsdWUpIHtcbiAgaWYgKCFfLmlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IGRhdGEudGhyZXNob2xkcy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICBpZiAodmFsdWUgPj0gZGF0YS50aHJlc2hvbGRzW2kgLSAxXSkge1xuICAgICAgcmV0dXJuIGRhdGEuY29sb3JNYXBbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF8uZmlyc3QoZGF0YS5jb2xvck1hcCk7XG59XG5cbmV4cG9ydCB7IEJsZW5kU3RhdEN0cmwsIEJsZW5kU3RhdEN0cmwgYXMgUGFuZWxDdHJsLCBnZXRDb2xvckZvclZhbHVlIH07XG4iXX0=