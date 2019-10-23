// app.js

// Takes mapId and populates the map with points that belong to it.
$(() => {
  //updates the coordinate and zoom values in _newMap ejs file to match those of the
  //map. Gets called on load as well as when map moves. Used when NEW MAP is being created
  const setCoordsInEjs = function(){
    document.getElementById('centerlat').value = map.getCenter()['lat'];
    document.getElementById('centerlong').value = map.getCenter()['lng'];
    document.getElementById('zoom').value =  map.getZoom();
  }
  if (document.getElementById('centerlat')) {
    setCoordsInEjs();
  }
  let myURL = window.location.href.split("/");
  let myId;

  if (myURL[3] === 'map') {
    myId = myURL[4];
  }
  if (myId) {
    $.ajax({
      method: "GET",
      url: `/map/${myId}/points`
    }).done((points) => {
      let markers = [];
      for (let point of points.points) {
        if(point.active) {
          const point_icon = L.icon({
            iconUrl: point.img_loc,
            iconSize:     [40, 45], // size of the icon
            iconAnchor:   [20, 45], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -45] // point from which the popup should open relative to the iconAnchor
          });
          L.marker([point.lat, point.long], {icon: point_icon}).addTo(map).bindPopup(`
          <b>${point.title}</b> <br>
          ${point.description} <br>
          <img src=${point.picture}  max width="150" max height="150"> <br>
          <i>created by: ${point.user_name}</i>
          `).on("click", function(event) {
            if (myURL[5] == 'editpoint') {
              document.getElementById('title').value = point.title;
              document.getElementById('description').value = point.description;
              document.getElementById('image').value = point.picture;
              dropdown = document.getElementById('dropdown')
              dropdown.value = point.keyword_id;
              dropdown.text = point.word;
              document.getElementById('pointid').value = point.id;
              document.getElementById('deletepointid').value = point.id;
            }
          })
          let markerL = [point.lat, point.long];
          markers.push(markerL);
        }
      }
      // maplat comes from map.ejs, passed from mapObj so all maps in database have it
      //check if it exists (not in create map mode)
      //if it does but there are less than 2 points in that map, set the map view to be the values from that
      //(its the default view for that map)
      let coords;
      let zoom;
      if (document.getElementById('maplat') && markers.length < 2) {
        coords = [document.getElementById('maplat').value, document.getElementById('maplong').value];
        zoom   = document.getElementById('mapzoom').value;
        map.setView(coords, zoom);
      } else {
        //if there are more than 2 points in that map, set the view to the extent of the points
        map.fitBounds(markers);
        zoom = map.getZoom();
        if (zoom > 14) {
          map.setZoom(14);
        } else {
        }
      }
    });
  } else {
    map.on("moveend", function() {
      setCoordsInEjs();
    })
  }
});


