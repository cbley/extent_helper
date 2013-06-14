require(['dojo/on', 'dojo/dom', 'dojo/html', 'esri/map'], function (on, dom, html, Map) {
    var map = new Map('map', {
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: 'gray'
    });

    function extentToFeatureSet(extent) {
        return{
            features: {
                geometry: {
                    rings: [
                        [
                            [extent.xmin, extent.ymin],
                            [extent.xmin, extent.ymax],
                            [extent.xmax, extent.ymax],
                            [extent.xmax, extent.ymin],
                            [extent.xmin, extent.ymin]
                        ]
                    ],
                    spatialReference: extent.spatialReference
                }
            }
        };
    }

    on(map, 'extent-change', function (e) {
        var extent = e.extent;
        html.set(dom.byId('extent'), JSON.stringify(extent, undefined, 2));

        var featureSet = extentToFeatureSet(extent);
        html.set(dom.byId('feature-set'), JSON.stringify(featureSet, undefined, 3));
    });
});