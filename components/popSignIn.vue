<template>
  <div>
    <v-btn rounded outlined @click.stop="dialog = true">
      <v-icon left>mdi-home-import-outline</v-icon>
      <span class="text-capitalize mx-1">Log In</span>
    </v-btn>

    <v-dialog v-model="dialog" max-width="60%">
     <client-only>
      <v-alert v-if="isError" type="error">
        {{ errMsg }}
      </v-alert>
      <v-card v-if="!emailsignin" >
        <v-container >
          <v-row>
            <v-card-title>
              <h1 class="display-1">Sign In</h1>
            </v-card-title>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn 
                @click="googleAuth"
                rounded
                class="pa-2 text-capitalize" 
                color="red" 
                x-large   
                block>
                <v-icon left >mdi-google</v-icon> Sign In With Google Account
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn 
                rounded
                class="pa-2 text-capitalize" 
                color="indigo" 
                x-large  
                block
                @click="emailsignin=!emailsignin">
                <v-icon left>mdi-email-check-outline</v-icon>
                Sign In With Email Account
              </v-btn> 
            </v-col>
          </v-row>
        </v-container>
    </v-card>

      <v-card v-if="emailsignin" class="mx-auto mt-5">
        <v-form @submit.prevent="signIn" class="pa-5">
          <v-card-title>
            <h1 class="display-1">Sign In</h1>
          </v-card-title>
          <v-card-text>

            <v-text-field
              @blur="checkUser"
              prepend-icon="mdi-email-check-outline"
              v-model="email"
              :rules="[rules.required, rules.email]"
              label="E-mail*"
              required
              clearable 
            />
            <v-text-field 
            v-if="emailexists || newuser"
              :type="showpass ? 'text' : 'password'" 
              prepend-icon="mdi-lock-open-outline"
              @keyup="match=comparePassword"
              :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
              v-model="password"
              :rules="[rules.required, rules.password]"
              label="Password*"                         
              @click:append="showpass = !showpass"
            />
            <p  v-if="!password && (emailexists || newuser)" class="caption info--text"  >Minimum eight characters, at least one uppercase letter, one lowercase letter and one number.</p>
            <v-text-field
              v-if="newuser"
              @keyup="match=comparePassword"
              type="password" 
              prepend-icon="mdi-lock-outline"
              v-model="password_confirmation"
              label="Confirm Password*"
              clearable                         
              required
            ></v-text-field>
            <p class="caption error--text" v-if="!match && newuser" >Passwords do not match</p>
            <v-text-field
              v-if="newuser"
              prepend-icon="mdi-account-circle"
              v-model="username"
              :rules="[rules.required, rules.counter]"
          
              label="User Name*"
              required
            ></v-text-field>
            <v-text-field
              v-if="newuser"
              prepend-icon="mdi-account-circle"
              v-model="username"
              :rules="[rules.required, rules.counter]"
          
              label="Surename"
              required
            ></v-text-field>
            <v-text-field
              v-if="newuser"
              prepend-icon="mdi-account-circle"
              v-model="username"
              :rules="[rules.required, rules.counter]"
          
              label="Name"
              required
            ></v-text-field>                       
          <v-divider></v-divider>
          <v-row align="center" justify="center" v-if="newuser" >
              <v-col cols="4">
              
                  <v-avatar v-if="!imageData.length > 0" size="90">
                      <v-img id="ProfileImage" src="the-pc-avatar-250.jpg"></v-img>
                  </v-avatar>
                  <v-avatar class="image-preview" v-if="imageData.length > 0"  size="120">
                  <v-img class="preview" :src="imageData"></v-img>
                  </v-avatar>

              </v-col>
              <v-col cols="7" offset="1">
                  <input
                    type="file"
                    style="display:none"
                    ref="imageinput"
                    accept="image/*"                                
                    @change="previewImage">  
                
                  <v-btn-toggle rounded    v-model="toggle_exclusive" >
                    <v-btn @click="onPickImg" >
                      <v-icon  class="mx-2" >mdi-camera</v-icon>Upload Image
                    </v-btn>
                    <v-btn @click="resetImage">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                
              </v-col>
          </v-row>
          <v-row v-if="newuser">
            <v-col cols="12">
              <v-select
                :prepend-icon="genterIcon"
                :items="genters"
                v-model="genter"
                label="Genter"
                required
              ></v-select>
            </v-col>
          </v-row>
          </v-card-text>
            <v-btn
                class="ma-4"
                v-if="emailexists && !newuser "
                x-small
                rounded 
                outlined 
                @click="resetPassword"
                text >Reset my password ?</v-btn>            
          <v-card-actions>   
              <v-btn 
                rounded 
                outlined 
                text 
                @click="dialog = newuser = emailexists =false"
                color="error"
                >Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn 
                v-if="!emailexists && !newuser"
                type="submit"
                rounded
                outlined
                color="warning"
                @click.prevent="checkUser"
                >
                Next
              </v-btn>            
              <v-btn 
                v-if="emailexists && !newuser "
                type="submit"
                rounded
                outlined
                color="success"
                @click.prevent="SignIn"
                >
                Sign In
              </v-btn>
              <v-btn 
                v-if="!emailexists && newuser"
                type="submit"
                rounded
                outlined
                color="success"
                @click.prevent="SignUp"
                >
                Sign Up
              </v-btn>     
          </v-card-actions>
        </v-form>
      </v-card>
      </client-only>
    </v-dialog>
  </div>
</template>

<script>
import fireservice from '../services/fireservice'

export default {
  name: 'popSignIn',
  data: () => ({
    toggle_exclusive: undefined,
    showpass: false,
    emailsignin: false,
    emailexists: false,
    newuser: false,
    dialog: false,
    showconf: false,
    genters: ['Male', 'Female'],
    valid: true,
    username: '',
    email: '',
    password: '',
    filename: '',
    file: '',
    genter: '',
    select: '',
    checkbox: '',
    password_confirmation: '',
    match: true,
    isError: false,
    errMsg: '',

    imageData: '', // we will store base64 format of image in this string
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      password: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        return pattern.test(value) || 'Invalid password.'
      },
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      }
    }
  }),
  methods: {
    async checkUser() {
      await fireservice
        .CheckUser(this.email)
        .then(res => {
          if (!res[0]) {
            this.emailexists = false
            this.newuser = true
          } else if (res[0] === 'password') {
            this.emailexists = true
            this.newuser = false
          } else if (res[0] === 'google.com') {
            this.googleAuth()
            // go to the idicated auth provider
            console.log(res)
          } else {
            // go to the idicated auth provider
            console.log(res)
          }
        })
        .catch(error => {
          this.isError = true
          this.errMsg = error.code
          this.newuser = false
          this.emailexists = false
          setTimeout(() => {
            this.isError = false
          }, 5000)
        })
    },
    async SignIn() {
      await fireservice
        .SignIn(this.email, this.password)
        .then(payload => {
          this.$store.dispatch('users/setUser', payload)
          this.$router.push('/' + this.$i18n.locale + '/')
        })
        .catch(error => {
          this.isError = true
          this.errMsg = error.code
          this.newuser = false
          this.emailexists = true
          setTimeout(() => {
            this.isError = false
          }, 5000)
        })
      // this.$store.dispatch('SignInUser', sub).then(this.$router.push('/about'))
    },
    async SignUp() {
      let profile = {}
      await fireservice
        .SignUp(this.email, this.password)
        .then(async payload => {
          this.$store.dispatch('users/setUser', payload)
          profile = {
            uid: payload.user.uid,
            email: payload.user.email
          }
          if (this.username !== '') {
            profile.username = this.username
          }
          if (this.filename !== '') {
            profile.filename =
              'profile_img/' + profile.uid + '/' + this.filename
            profile.file = this.file
            profile.picture = await fireservice.UploadImg(
              profile.filename,
              profile.file
            )
            delete profile.file
          }
          if (this.genter !== '') {
            profile.genter = this.genter
          }
          const responce = await fireservice.AddProfile(profile)
          this.$router.push('/' + this.$i18n.locale + '/')
          return responce
        })

        .catch(error => {
          this.isError = true
          this.errMsg = error.code
          this.newuser = false
          this.emailexists = true
          setTimeout(() => {
            this.isError = false
          }, 5000)
        })
    },
    async resetPassword() {
      const reset = await fireservice.resetPassword(
        this.email,
        this.$i18n.locale
      )
      console.log(reset)
    },
    async googleAuth() {
      let profile = {}
      await fireservice
        .googleAuth(this.$i18n.locale)
        .then(async payload => {
          this.$store.dispatch('users/setUser', payload)
          profile = payload.profile
          profile.uid = payload.user.uid
          const responce = await fireservice.AddProfile(profile)
          this.$router.push('/' + this.$i18n.locale + '/')
          return responce
        })
        .catch(error => {
          this.isError = true
          this.errMsg = error.code
          this.newuser = false
          this.emailexists = true
          setTimeout(() => {
            this.isError = false
          }, 5000)
        })
    },

    onPickImg() {
      this.$refs.imageinput.click()
    },
    previewImage(event) {
      const input = event.target
      if (input.files.length) {
        this.imageData = ''
      }
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        this.file = input.files[0]
        this.filename = input.files[0].name
        const reader = new FileReader()
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = e => {
          this.imageData = e.target.result
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0])
      }
    },

    resetImage() {
      this.imageData = ''
      this.file = ''
      this.filename = ''
    }
  },
  computed: {
    comparePassword() {
      if (this.password === this.password_confirmation) {
        return true
      } else return false
    },
    validate() {
      return (
        this.match &&
        this.valid &&
        this.username &&
        this.email &&
        this.password_confirmation &&
        this.password
      )
    },
    genterIcon() {
      let icon = ''
      switch (this.genter) {
        case '':
          icon = 'mdi-gender-male-female'
          break
        case 'Male':
          icon = 'mdi-gender-male'
          break
        case 'Female':
          icon = 'mdi-gender-female'
          break
      }
      return icon
    }
  }
}
</script>
