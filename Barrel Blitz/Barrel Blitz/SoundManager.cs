using System;
using System.Collections.Generic;
using System.Linq;
using System.Media;
using System.Text;
using System.Threading.Tasks;

namespace __Barrel_Blitz_
{
    internal class SoundManager
    {
        private static SoundPlayer startPlayer = new SoundPlayer();
        private static SoundPlayer addPlayer = new SoundPlayer();
        private static SoundPlayer blastPlayer = new SoundPlayer();
        private static SoundPlayer hitPlayer = new SoundPlayer();
        private static SoundPlayer firePlayer = new SoundPlayer();
        public static void InitSound()
        {
            startPlayer.Stream = Properties.Resources.start;
            addPlayer.Stream = Properties.Resources.add;
            blastPlayer.Stream = Properties.Resources.blast;
            hitPlayer.Stream = Properties.Resources.hit;
            firePlayer.Stream = Properties.Resources.fire;
        }
        public static void PlayStart()
        {
            startPlayer.Play();
        }
        public static void PlayAdd()
        {
            addPlayer.Play();
        }
        public static void PlayBlast()
        {
            blastPlayer.Play();
        }
        public static void PlayHit()
        {
            hitPlayer.Play();
        }
        public static void PlayFire()
        {
            firePlayer.Play();
        }
    }
}
