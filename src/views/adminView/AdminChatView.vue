<template>
  <!-- Chat App Container -->
  <main class="h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row overflow-hidden transition-all duration-300"
       :class="[themeClasses.cardBackground]">

      <!-- ── Left panel: patient list ─────────────────────────────── -->
        <aside
          class="flex flex-col w-full md:w-80 lg:w-96 border-r shrink-0 transition-all duration-300 relative z-10 block"
          :class="[themeClasses.border, selectedUser ? 'hidden md:flex' : 'flex', isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50']"
        >
          <!-- Header -->
          <div class="px-5 pt-6 pb-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                     :class="isDarkMode ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-blue-400 to-blue-600'">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h1 class="text-base font-bold tracking-wide" :class="themeClasses.textPrimary">
                  {{ t('admin.patientMessagesTitle') || 'Patients' }}
                </h1>
              </div>
              <button
                type="button"
                @click="loadAssignedUsers"
                :disabled="usersLoading"
                class="p-2 rounded-xl transition-all duration-200 hover:shadow-sm active:scale-95 disabled:opacity-40"
                :class="isDarkMode ? 'hover:bg-gray-700 text-gray-300 bg-gray-800' : 'hover:bg-white text-gray-600 bg-gray-100'"
                title="Refresh"
              >
                <svg class="w-4 h-4" :class="{ 'animate-spin': usersLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <!-- Search -->
            <div class="relative group">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors"
                   :class="isDarkMode ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('common.search') || 'Search patients…'"
                class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                :class="[themeClasses.inputBackground, themeClasses.border, themeClasses.textPrimary]"
              />
            </div>
          </div>

          <!-- Patient list -->
          <div class="flex-1 overflow-y-auto px-3 custom-scrollbar">
            <!-- Loading skeleton -->
            <template v-if="usersLoading">
              <div v-for="n in 6" :key="n" class="flex items-center gap-4 p-3 rounded-2xl mb-2 animate-pulse"
                   :class="isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'">
                <div class="w-12 h-12 rounded-full shrink-0" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" />
                <div class="flex-1 space-y-2.5 py-1">
                  <div class="h-3 rounded-full w-2/3" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" />
                  <div class="h-2 rounded-full w-1/2" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'" />
                </div>
              </div>
            </template>

            <div v-else-if="filteredUsers.length === 0" class="flex flex-col items-center justify-center h-40 text-center px-4 opacity-70">
              <svg class="w-10 h-10 mb-3" :class="themeClasses.textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p class="text-sm border p-3 rounded-xl" :class="[themeClasses.textSecondary, themeClasses.border, themeClasses.cardBackground]">
                {{ searchQuery ? (t('common.noResults') || 'No matching patients') : t('admin.noAssignedUsers') }}
              </p>
            </div>

            <transition-group name="list" tag="div" class="space-y-1.5 pb-4">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                class="relative group"
              >
                <button
                  type="button"
                  @click="selectUser(user)"
                  class="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-200 text-left border border-transparent"
                  :class="selectedUser?.id === user.id
                    ? (isDarkMode 
                        ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                        : 'bg-white border-blue-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-black/5')
                    : (isDarkMode 
                        ? 'hover:bg-gray-800 focus:bg-gray-800' 
                        : 'hover:bg-white focus:bg-white hover:shadow-sm')"
                >
                  <!-- Avatar -->
                  <div class="relative shrink-0">
                    <img v-if="user.icon" :src="user.icon" alt="User Icon" class="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-transparent transition-all" 
                         :class="selectedUser?.id === user.id ? 'ring-blue-500/50' : ''" />
                    <div v-else class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base text-white shadow-sm ring-2 ring-transparent transition-all"
                         :class="selectedUser?.id === user.id ? 'ring-blue-500/50' : ''"
                         :style="{ background: stringToColor(user.name) }">
                      {{ initials(user.name) }}
                    </div>
                    <span
                      v-if="user.unreadCount > 0"
                      class="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-bounce-short ring-2"
                      :class="isDarkMode ? 'ring-gray-900' : 'ring-white'"
                    >
                      {{ user.unreadCount > 99 ? '99+' : user.unreadCount }}
                    </span>
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-0.5">
                      <p class="text-sm font-bold truncate transition-colors" 
                         :class="selectedUser?.id === user.id ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : themeClasses.textPrimary">
                        {{ user.name }}
                      </p>
                      <span v-if="user.lastMessageTime" class="text-[11px] font-medium shrink-0" :class="themeClasses.textSecondary">
                        {{ formatTime(user.lastMessageTime) }}
                      </span>
                    </div>
                    <p class="text-[13px] truncate"
                       :class="user.unreadCount > 0 
                         ? (isDarkMode ? 'text-gray-200 font-semibold' : 'text-gray-900 font-semibold') 
                         : themeClasses.textSecondary">
                      <span v-if="user.unreadCount > 0" class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 align-middle"></span>
                      {{ user.lastMessage || user.email }}
                    </p>
                  </div>
                </button>

                <!-- Delete Button overlay -->
                <button
                  @click.stop="deleteChat(user)"
                  class="absolute top-1/2 -mt-4 right-3 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 hover:scale-110 z-10 translate-x-2 group-hover:translate-x-0"
                  :title="t('admin.deleteChatHistory') || 'Delete Chat'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </transition-group>
          </div>
        </aside>

        <!-- ── Right panel: chat ────────────────────────────────────── -->
        <div class="flex-1 flex flex-col min-w-0 bg-transparent relative z-0" :class="[!selectedUser ? 'hidden md:flex' : 'flex']">

          <!-- Chat header -->
          <div v-if="selectedUser" class="flex items-center gap-4 px-4 sm:px-6 py-4 border-b shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10"
               :class="themeClasses.border">
            <button 
              @click="selectedUser = null" 
              class="md:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group">
              <div class="relative shrink-0 transition-transform group-hover:scale-105">
                <img v-if="selectedUser.icon || receiverIcon" :src="selectedUser.icon || receiverIcon" alt="User Icon" class="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-gray-800" />
                <div v-else class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base text-white shadow-sm ring-2 ring-white dark:ring-gray-800"
                     :style="{ background: stringToColor(selectedUser.name) }">
                  {{ initials(selectedUser.name) }}
                </div>
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-bold truncate tracking-tight" :class="themeClasses.textPrimary">{{ selectedUser.name }}</h2>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <p class="text-xs truncate" :class="themeClasses.textSecondary">{{ selectedUser.email }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="h-20 border-b flex items-center px-6 shrink-0" :class="themeClasses.border">
             <div class="w-full h-8 bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse max-w-sm"></div>
          </div>

          <!-- Messages area using a slight background pattern or distinct color -->
          <div
            class="flex-1 relative bg-cover bg-center"
            :class="isDarkMode ? 'bg-gray-900' : 'bg-[#E5DDD5] sm:bg-[#f0f2f5]'"
          >
            <!-- Chat wallpaper (subtle pattern) -->
            <div class="absolute inset-0 opacity-10 md:opacity-5 pointer-events-none"
                 style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
            
            <div ref="messagesContainer" class="absolute inset-0 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 custom-scrollbar">
              
              <!-- Loading -->
              <div v-if="messagesLoading" class="flex flex-col gap-6 w-full max-w-4xl mx-auto">
                <div v-for="n in 5" :key="n"
                     class="flex"
                     :class="n % 2 === 0 ? 'justify-end' : 'justify-start'">
                  <div class="rounded-2xl h-12 shadow-sm animate-pulse"
                       :class="[
                         n % 2 === 0
                           ? (isDarkMode ? 'bg-blue-600/40 rounded-br-none' : 'bg-blue-200 rounded-br-none')
                           : (isDarkMode ? 'bg-gray-800 rounded-bl-none' : 'bg-white rounded-bl-none'),
                         n % 3 === 0 ? 'w-48' : n % 3 === 1 ? 'w-64' : 'w-36'
                       ]" />
                </div>
              </div>

              <!-- Empty state -->
              <div v-else-if="!selectedUser || messages.length === 0"
                   class="flex flex-col items-center justify-center h-full text-center px-8 relative z-10 w-full max-w-md mx-auto">
                <div class="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ring-8"
                     :class="isDarkMode ? 'bg-gray-800 ring-gray-800/50 text-blue-500' : 'bg-blue-50 ring-blue-50/50 text-blue-500'">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2 tracking-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                  {{ selectedUser ? (t('admin.noPatientMessages') || 'No messages yet') : (t('admin.selectPatient') || 'Select a patient') }}
                </h3>
                <p class="text-[15px] leading-relaxed" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  {{ selectedUser ? (t('chat.startConversation') || 'Send the first message below to start the conversation.') : (t('admin.selectPatientHint') || 'Select a patient from the list to start chatting.') }}
                </p>
                
                <div v-if="!selectedUser" class="mt-8 flex gap-3 opacity-60">
                  <div class="w-12 h-3 rounded-full bg-gray-400"></div>
                  <div class="w-12 h-3 rounded-full bg-gray-300"></div>
                  <div class="w-12 h-3 rounded-full bg-gray-400"></div>
                </div>
              </div>

              <!-- Messages -->
              <template v-else>
                <div class="w-full max-w-4xl mx-auto flex flex-col gap-2 relative z-10">
                  <template
                    v-for="(message, index) in messages"
                    :key="message.id"
                  >
                    <!-- Date separator -->
                    <div
                      v-if="index === 0 || !sameDay(messages[index - 1], message)"
                      class="flex justify-center my-5 sticky top-2 z-20"
                    >
                      <span class="text-[11px] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border"
                            :class="isDarkMode ? 'bg-gray-800/80 text-gray-300 border-gray-700/50' : 'bg-white/80 text-gray-600 border-gray-200/50'">
                        {{ formatDateLabel(message.time) }}
                      </span>
                    </div>

                    <!-- Message row -->
                    <div
                      class="flex group transition-all"
                      :class="[
                        message.isUser ? 'justify-start' : 'justify-end',
                        (index > 0 && messages[index - 1].isUser === message.isUser && sameDay(messages[index - 1], message)) ? 'mt-0' : 'mt-2'
                      ]"
                    >
                      <div class="flex items-end gap-2 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]"
                           :class="message.isUser ? 'flex-row' : 'flex-row-reverse'">
                        
                        <!-- Avatar doc / user (only show on the last message in a block) -->
                        <div class="w-7 h-7 shrink-0 hidden sm:block">
                          <template v-if="(index === messages.length - 1 || messages[index + 1].isUser !== message.isUser || !sameDay(messages[index + 1], message))">
                            <template v-if="message.isUser">
                              <img v-if="selectedUser?.icon || receiverIcon" :src="selectedUser?.icon || receiverIcon" alt="User" class="w-7 h-7 rounded-full object-cover shadow-sm ring-1 ring-white/50" />
                              <div v-else class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm ring-1"
                                   :class="isDarkMode ? 'ring-gray-800' : 'ring-white/50'"
                                   :style="{ background: stringToColor(selectedUser?.name || 'P') }">
                                {{ initials(selectedUser?.name || 'P') }}
                              </div>
                            </template>
                            <template v-else>
                              <img v-if="adminIcon" :src="adminIcon" alt="Admin" class="w-7 h-7 rounded-full object-cover shadow-sm ring-1 ring-white/50" />
                              <div v-else class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm ring-1"
                                   :class="isDarkMode ? 'ring-gray-800' : 'ring-white/50'"
                                   style="background: #3b82f6">
                                A
                              </div>
                            </template>
                          </template>
                        </div>

                        <!-- Bubble -->
                        <div
                          class="px-4 py-2.5 shadow-sm text-[15px] leading-relaxed relative"
                          :class="[
                            message.isUser
                              ? (isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900')
                              : (isDarkMode ? 'bg-blue-600 text-white' : 'bg-[#005c4b] sm:bg-[#d9fdd3] text-white sm:text-gray-900'),
                            
                            // Border radius logic to group bubbles
                            message.isUser ? 'rounded-2xl rounded-bl-sm' : 'rounded-2xl rounded-br-sm'
                          ]"
                        >
                          <!-- The Little tail (SVG corner) -->
                          <svg v-if="message.isUser && (index === messages.length - 1 || messages[index + 1].isUser !== message.isUser || !sameDay(messages[index + 1], message))" viewBox="0 0 8 13" width="8" height="13" class="absolute bottom-0 -left-2" :class="isDarkMode ? 'text-gray-800' : 'text-white'" fill="currentColor">
                            <path opacity="1" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"></path>
                          </svg>
                          <svg v-if="!message.isUser && (index === messages.length - 1 || messages[index + 1].isUser !== message.isUser || !sameDay(messages[index + 1], message))" viewBox="0 0 8 13" width="8" height="13" class="absolute bottom-0 -right-2" :class="isDarkMode ? 'text-blue-600' : 'text-[#005c4b] sm:text-[#d9fdd3]'" fill="currentColor">
                            <path opacity="1" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path>
                          </svg>

                          <p v-if="message.text" class="whitespace-pre-wrap word-break" style="word-break: break-word;">{{ message.text }}</p>
                          
                          <div v-if="message.fileName" class="mt-2 mb-1">
                            <button @click="downloadFile(message.id, message.fileName)" 
                                class="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 group/btn"
                                :class="message.isUser 
                                    ? (isDarkMode ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100') 
                                    : (isDarkMode ? 'bg-blue-700/30 border-blue-500/50 hover:bg-blue-700/50' : 'bg-black/5 sm:bg-white/40 border-black/10 sm:border-emerald-600/20 hover:bg-black/10 sm:hover:bg-white/60')">
                              <div class="p-2 rounded-lg shrink-0 transition-transform group-hover/btn:scale-110" :class="message.isUser ? (isDarkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : 'bg-white/20 sm:bg-white shadow-sm'">
                                <svg class="w-5 h-5" :class="message.isUser ? 'text-blue-500' : (isDarkMode ? 'text-white' : 'text-white sm:text-emerald-600')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div class="flex-1 min-w-0 pr-2">
                                <span class="text-sm font-semibold truncate block" :class="message.isUser ? themeClasses.textPrimary : 'text-white sm:text-gray-900'">
                                  {{ message.fileName }}
                                </span>
                                <span class="text-[10px] uppercase tracking-wider opacity-70 mt-0.5 block" :class="!message.isUser && !isDarkMode ? 'text-emerald-800' : ''">Document</span>
                              </div>
                            </button>
                          </div>
                          
                          <div class="flex items-center justify-end gap-1 mt-1 font-medium select-none"
                               :class="message.isUser ? (isDarkMode ? 'text-gray-400' : 'text-gray-400') : (isDarkMode ? 'text-blue-200' : 'text-green-100 sm:text-emerald-700/70')">
                            <span class="text-[10px]">{{ formatMsgTime(message.time).split(' ')[1] || formatMsgTime(message.time) }}</span>
                            <svg v-if="!message.isUser" class="w-3.5 h-3.5" viewBox="0 0 16 15" fill="none" stroke="currentColor"><path d="M15.01 3.316l-8.49 8.49-3.79-3.791 M10.23 3.316l-4.22 4.22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>

          <!-- Input area -->
          <div class="px-4 sm:px-6 py-4 shrink-0 transition-colors z-10"
               :class="[isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-[#f0f2f5] border-t border-gray-200']">

            <!-- File preview -->
            <transition name="fade">
              <div v-if="selectedFile"
                   class="flex items-center gap-3 px-4 py-2.5 mb-3 rounded-xl border shadow-sm w-max max-w-full backdrop-blur-sm"
                   :class="[isDarkMode ? 'bg-gray-700/90 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700']">
                <div class="p-1.5 rounded-lg" :class="isDarkMode ? 'bg-gray-600' : 'bg-blue-50 text-blue-500'">
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex flex-col min-w-0 flex-1 pr-4">
                  <span class="text-sm font-semibold truncate">{{ selectedFile.name }}</span>
                  <span class="text-[10px] opacity-70">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
                </div>
                <button type="button" @click="clearSelectedFile"
                        class="p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-500/20">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </transition>

            <form @submit.prevent="sendMessage" class="flex items-end gap-2.5 max-w-4xl mx-auto">
              <!-- File attach -->
              <input ref="fileInputRef" type="file" class="hidden" @change="onFileSelected" />
              <button type="button" @click="triggerFilePicker"
                      :disabled="!selectedUser || isSending"
                      class="p-3 rounded-full transition-all duration-200 disabled:opacity-40 hover:scale-105 active:scale-95"
                      :class="[isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-500 hover:text-blue-500 hover:shadow-sm']"
                      :title="t('chat.attachFile')">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <!-- Text input wrapper -->
              <div class="flex-1 relative flex items-end bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-transparent focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <textarea
                  v-model="newMessage"
                  @keydown.enter.exact.prevent="sendMessage"
                  rows="1"
                  :placeholder="selectedUser ? (t('chat.typePlaceholder') || 'Type a message…') : (t('admin.selectPatientHint') || 'Select a patient to start chatting')"
                  :disabled="!selectedUser || isSending"
                  class="w-full pl-5 pr-12 py-3.5 bg-transparent resize-none focus:outline-none text-[15px] leading-relaxed transition disabled:opacity-50"
                  :class="[themeClasses.textPrimary]"
                  style="max-height:150px; min-height:50px;"
                />
              </div>

              <!-- Send -->
              <button
                type="submit"
                :disabled="(!newMessage.trim() && !selectedFile) || !selectedUser || isSending"
                class="p-3.5 rounded-full font-bold transition-all duration-200 disabled:opacity-40 shadow-sm disabled:shadow-none"
                :class="newMessage.trim() || selectedFile 
                  ? (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95')
                  : (isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')"
              >
                <svg v-if="!isSending" class="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </button>
            </form>

            <div class="flex items-center justify-between mt-2 max-w-4xl mx-auto px-1">
              <p class="text-[11px] font-medium" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">Press Enter to send, Shift + Enter for new line</p>
              <p v-if="errorMessage" class="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import { useLanguage } from '../../composables/useLanguage'
import { fetchAdminChatHistory, fetchAdminChatUsers, fetchCurrentUserProfile, sendAdminChatMessage, deleteAdminChatHistory, downloadAdminChatFile } from '../../services/userChatService'

const route = useRoute()
const { themeClasses, isDarkMode } = useTheme()
const { t } = useLanguage()

const users = ref([])
const searchQuery = ref('')
const selectedUser = ref(null)
const usersLoading = ref(false)
const messagesLoading = ref(false)
const messages = ref([])
const errorMessage = ref('')
const adminId = ref(null)
const messagesContainer = ref(null)
const newMessage = ref('')
const isSending = ref(false)
const selectedFile = ref(null)
const fileInputRef = ref(null)
const receiverIcon = ref(null)
const adminIcon = ref(null)

// ── Helpers ──────────────────────────────────────────────────────────────────

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

const initials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'

const stringToColor = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const h = Math.abs(hash) % 360
  return `hsl(${h},55%,45%)`
}

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const diff = now - d
  if (diff < 7 * 86400000) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const formatDateLabel = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
}

// Show yyyy/mm/dd HH:MM inside a message bubble
const formatMsgTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`
  }
  return String(ts)
}

const sameDay = (a, b) => {
  const da = new Date(a?.time || 0)
  const db = new Date(b?.time || 0)
  return da.toDateString() === db.toDateString()
}

// ── Data loading ──────────────────────────────────────────────────────────────

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const loadProfile = async () => {
  try {
    const profile = await fetchCurrentUserProfile()
    const userData = profile?.data?.user || profile?.data || profile?.user || profile
    adminId.value = userData?.id || userData?._id || null
    if (userData?.icon) {
      adminIcon.value = userData.icon
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load admin profile'
  }
}

const loadAssignedUsers = async () => {
  usersLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetchAdminChatUsers()
    users.value = (response?.users || []).map((user) => ({
      id: user.userId || user.id || user._id,
      name: user.name || user.email || 'User',
      email: user.email || '',
      icon: user.icon || null,
      unreadCount: user.unreadCount || 0,
      lastMessage: user.lastMessage,
      lastMessageTime: user.lastMessageTime
    }))

    // Check if there's a userId in the query params to auto-select
    const queryUserId = route.query.userId
    if (queryUserId) {
      let userToSelect = users.value.find(u => String(u.id) === String(queryUserId))
      
      // If user is not in the assigned users list, create a temporary user object
      if (!userToSelect) {
        userToSelect = {
          id: queryUserId,
          name: route.query.userName || 'User', // We don't have the name, but we can still open the chat
          email: route.query.userEmail || '',
          unreadCount: 0
        }
        // Add to the top of the list so it's visible
        users.value.unshift(userToSelect)
      } else {
        // Update name and email if they are provided in query and missing in the list
        if (route.query.userName && userToSelect.name === 'User') {
          userToSelect.name = route.query.userName
        }
        if (route.query.userEmail && !userToSelect.email) {
          userToSelect.email = route.query.userEmail
        }
      }
      
      await selectUser(userToSelect)
    } else if (!selectedUser.value && users.value.length > 0) {
      // selectUser(users.value[0]) // Don't auto-select, let them choose? Or auto-select first is fine.
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load chat users'
  } finally {
    usersLoading.value = false
  }
}

const selectUser = async (user) => {
  selectedUser.value = user
  // Reset unread count locally for UI feedback
  user.unreadCount = 0
  messagesLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetchAdminChatHistory(user.id, adminId.value)
    messages.value = response?.messages || []
    receiverIcon.value = response?.receiverIcon || null
    if (response?.icon) {
      adminIcon.value = response.icon
    }
    
    // Dispatch event to update unread count in top bar
    window.dispatchEvent(new CustomEvent('messagesRead'))
  } catch (error) {
    messages.value = []
    receiverIcon.value = null
    errorMessage.value = error.message || 'Failed to load patient messages'
  } finally {
    messagesLoading.value = false
    scrollToBottom()
  }
}

const deleteChat = async (user) => {
  if (!confirm(t('admin.confirmDeleteChat') || 'Are you sure you want to delete this chat history? This action cannot be undone.')) return
  
  try {
    await deleteAdminChatHistory(user.id)
    
    // Clear messages if the deleted chat is currently selected
    if (selectedUser.value?.id === user.id) {
      messages.value = []
      selectedUser.value = null
    }
    
    // Remove the user from the list
    users.value = users.value.filter(u => u.id !== user.id)
    
    // Dispatch event to update unread count in top bar
    window.dispatchEvent(new CustomEvent('messagesRead'))
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete chat history'
  }
}

const triggerFilePicker = () => {
  fileInputRef.value?.click()
}

const onFileSelected = (event) => {
  const file = event?.target?.files?.[0] || null
  selectedFile.value = file
}

const clearSelectedFile = () => {
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const downloadFile = async (messageId, fileName) => {
  try {
    await downloadAdminChatFile(messageId, fileName)
  } catch (error) {
    console.error('Error downloading file:', error)
    errorMessage.value = error.message || 'Failed to download file'
  }
}

const sendMessage = async () => {
  if ((!newMessage.value.trim() && !selectedFile.value) || !selectedUser.value || isSending.value) return

  isSending.value = true
  errorMessage.value = ''
  const text = newMessage.value.trim()
  const file = selectedFile.value
  newMessage.value = ''
  clearSelectedFile()

  try {
    const response = await sendAdminChatMessage(selectedUser.value.id, text, adminId.value, file)
    if (response?.message) {
      messages.value.push(response.message)
      scrollToBottom()
    } else {
      await selectUser(selectedUser.value)
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to send patient message'
    newMessage.value = text
    selectedFile.value = file
  } finally {
    isSending.value = false
  }
}

onMounted(async () => {
  await loadProfile()
  await loadAssignedUsers()
})

watch(() => route.query.userId, async (newUserId) => {
  if (newUserId) {
    let userToSelect = users.value.find(u => String(u.id) === String(newUserId))
    
    if (!userToSelect) {
      userToSelect = {
        id: newUserId,
        name: route.query.userName || 'User',
        email: route.query.userEmail || '',
        unreadCount: 0
      }
      users.value.unshift(userToSelect)
    } else {
      if (route.query.userName && userToSelect.name === 'User') {
        userToSelect.name = route.query.userName
      }
      if (route.query.userEmail && !userToSelect.email) {
        userToSelect.email = route.query.userEmail
      }
    }
    
    if (!selectedUser.value || String(selectedUser.value.id) !== String(newUserId)) {
      await selectUser(userToSelect)
    }
  }
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.animate-bounce-short {
  animation: bounce-short 1s ease-in-out 1;
}

@keyframes bounce-short {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8);
}
</style>
