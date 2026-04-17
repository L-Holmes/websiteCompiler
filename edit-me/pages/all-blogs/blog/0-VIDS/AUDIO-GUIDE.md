

#1)

```
wpctl status
```
#2)
Then look for the id of the scarlettrite solo entry under  'Filters' 
That says 'Mic 1' and 'Audio / Source'

```
....
 ├─ Devices:
...
 │      68. Scarlett Solo (3rd Gen.)            [alsa]
 │
 ├─ Sinks:
...
 │      75. Scarlett Solo (3rd Gen.) Headphones / Line 1-2 [vol: 0.40]
 │
 ├─ Sources:
....
 │      73. Scarlett Solo (3rd Gen.) 0          [vol: 1.00]
 │
 ├─ Filters:
 │    - loopback-601921-15
 │      70. alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.HiFi__Mic2__source.split [Stream/Input/Audio/Internal]
 │      72. alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.HiFi__Mic2__source [Audio/Source]
 │    - loopback-601921-16
 │  *   !!! 74 !!!. alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.HiFi__Mic1__source [Audio/Source]
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 │      76. alsa_input.usb-Focusrite_Scarlett_Solo_USB_Y7NMT21137C1B5-00.HiFi__Mic1__source.split [Stream/Input/Audio/Internal]
 │
 └─ Streams:


Settings
 └─ Default Configured Devices:
```

#3)
Set that as default
```
wpctl set-default 74
```
