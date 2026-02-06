package com.sinapselab.mobile

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
