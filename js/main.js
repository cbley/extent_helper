require([
    'dojo/on',
    'dojo/dom',
    'dojo/html',
    'esri/map',
    'esri/SpatialReference',
    'esri/geometry/Extent',
    'esri/tasks/GeometryService'],

    function (on, dom, html, Map, SpatialReference, Extent, GeometryService) {

        var map = new Map('map', {
                center: [-56.049, 38.485],
                zoom: 3,
                basemap: 'gray'
            }),
        //geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            geometryService = new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer"),
            spatialReferenceSelect = dom.byId('spatial-reference-select');

        function extentToFeatureSet(extent) {
            return {
                features: [
                    geometry: {
                        rings: [
                            [
                                [extent.xmin, extent.ymin],
                                [extent.xmax, extent.ymin],
                                [extent.xmax, extent.ymax],
                                [extent.xmin, extent.ymax],
                                [extent.xmin, extent.ymin]
                            ]
                        ],
                        spatialReference: extent.spatialReference
                    }
                ]
            };
        }

        function updateExtent() {
            var currentSR = getSelectedSR(),
                currentExtent = map.extent;
            if (map.spatialReference.wkid !== currentSR) {
                var sr = new SpatialReference(currentSR);
                geometryService.project([currentExtent], sr).then(function (results) {
                    var projectedExtent = results[0];
                    printExtent(projectedExtent);
                }, function (e) {
                    console.log('Error with geometry service!');
                    console.log(e);
                });
            } else {
                printExtent(currentExtent);
            }
        }

        function printExtent(extent) {
            html.set(dom.byId('extent'), JSON.stringify(extent, undefined, 2));

            var featureSet = extentToFeatureSet(extent);
            html.set(dom.byId('feature-set'), JSON.stringify(featureSet, undefined, 3));
        }

        function getSelectedSR() {
            return parseInt(spatialReferenceSelect.value, 10);
        }

        on(map, 'extent-change', function (e) {
            updateExtent();
        });

        on(spatialReferenceSelect, 'change', function (e) {
            updateExtent();
        });

        on(map, 'load', function () {
            updateExtent();
        });
    }
);
