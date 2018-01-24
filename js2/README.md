1. dat.gui.jsのGUIインスタンスをwindowに登録するように追加

  ```
   var gui = new dat.GUI();
   window.gui = gui;
  ```

2. 'edotMidi.js'を読み込むように追加

  ```
   <script src="path/to/edotMidi.js"></script>
  ```
