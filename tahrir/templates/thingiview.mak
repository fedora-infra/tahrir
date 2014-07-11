<%inherit file="master.mak" />
<head>
  <script src="${request.static_url('tahrir:static/js/thingiview/Three.js')}"></script>
  <script src="${request.static_url('tahrir:static/js/thingiview/plane.js')}"></script>
  <script src="${request.static_url('tahrir:static/js/thingiview/thingiview.js')}"></script>

  <script>
    window.onload = function() {
      thingiurlbase = "${request.static_url('tahrir:static/js/thingiview')}";
      thingiview = new Thingiview("thingiviewer");
      thingiview.setObjectColor('#C0D8F0');
      thingiview.initScene();
      thingiview.loadSTL("${stl_url}");
    }
  </script>

</head>
<div class="page">
  <!-- COLUMN 1 (Left)-->
  <div class="grid-70 push-15">
    <div class="shadow">
      <h1 class="section-header">Wow</h1>
      <div class="padded-content">
        <div class="centered" id="thingiviewer" style="width:450px;height:450px"></div>
      </div>
    </div>
  </div>
  <div class="clear spacer"></div>
</div>
