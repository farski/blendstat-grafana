# Blendstat Panel

> [!CAUTION]
> This project is no longer maintained. Consider use of the native [stat panel](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/stat/) and [transformations](https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/transform-data/) the acheive similar functionality in recent versions of Grafana.


The Blendstat Panel is a third-party [Grafana](https://grafana.com/) visualization panel. It is nearly identical to the native [Singlestat](http://docs.grafana.org/features/panels/singlestat/), except it allows for multiple series or queries.

Values from different queries are combined (blended) into single series based on a user-selected function (e.g., `Average`, `Total`, etc) prior to the value for the panel being calculated. Values are blended when they share a timestamp.
